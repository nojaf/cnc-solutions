export const API_BASE =
  "https://cncsolutions-backend.azurewebsites.net/umbraco/api";

export interface UmbracoUrl {
  nl: string;
  en: string;
  fr: string;
}

export type Culture = "nl" | "en" | "fr";
export const cultures: Culture[] = ["nl", "en", "fr"];

export interface UmbracoNode {
  id: number;
  sortOrder: number;
  name: string;
  alias: string;
  url: UmbracoUrl;
  updateDate: string;
  parentId: number | null;
  properties: Record<string, any>;
  children: UmbracoNode[];
}

export interface UmbracoTree {
  cultures: string[];
  root: UmbracoNode;
}

// --- Cached tree fetch ---

// The promise is cached, not the result: every collection loader calls this
// at the same time during content sync, and a result cache would fetch once
// per collection.
let cachedTree: Promise<UmbracoTree> | null = null;

export function getTree(): Promise<UmbracoTree> {
  cachedTree ??= (async () => {
    const response = await fetch(`${API_BASE}/graph/tree`);
    const tree: UmbracoTree = await response.json();
    await replaceMissingMedia(tree.root);
    return tree;
  })();
  return cachedTree;
}

// --- Missing media ---

const MEDIA_URL = /^https?:\/\/[^/]+\/media\//;
export const MISSING_MEDIA = "/media-missing.svg";

function mediaValues(root: UmbracoNode): Array<[Record<string, any>, string]> {
  const found: Array<[Record<string, any>, string]> = [];
  const walk = (holder: Record<string, any>) => {
    for (const [key, value] of Object.entries(holder)) {
      if (typeof value === "string" && MEDIA_URL.test(value)) {
        found.push([holder, key]);
      } else if (value && typeof value === "object") {
        walk(value);
      }
    }
  };
  for (const node of flattenTree(root)) walk(node.properties);
  return found;
}

/**
 * A media file deleted from Umbraco would fail `getImage()` and stop the whole
 * build. Check every distinct file once (about 200 HEAD requests) and point
 * references to a 404 at a local placeholder instead, with a warning.
 */
async function replaceMissingMedia(root: UmbracoNode): Promise<void> {
  const refs = mediaValues(root);
  const files = [...new Set(refs.map(([h, k]) => h[k].split("?")[0]))];
  const missing = new Set<string>();
  let next = 0;
  await Promise.all(
    Array.from({ length: 10 }, async () => {
      while (next < files.length) {
        const url = files[next++];
        try {
          const res = await fetch(url, { method: "HEAD" });
          if (res.status === 404) missing.add(url);
        } catch {
          // Network trouble is not a missing file; let the build report it.
        }
      }
    }),
  );
  if (missing.size === 0) return;
  for (const [holder, key] of refs) {
    if (missing.has(holder[key].split("?")[0])) holder[key] = MISSING_MEDIA;
  }
  console.warn(
    `[umbraco] ${missing.size} media file(s) return 404 and were replaced by ${MISSING_MEDIA}:\n  ${[...missing].join("\n  ")}`,
  );
}

export function clearTreeCache(): void {
  cachedTree = null;
}

// --- Tree traversal ---

export function flattenTree(node: UmbracoNode): UmbracoNode[] {
  return [node, ...node.children.flatMap(flattenTree)];
}

export function getNodesByAlias(
  root: UmbracoNode,
  alias: string,
): UmbracoNode[] {
  return flattenTree(root).filter((n) => n.alias === alias);
}

export function getNodeById(
  root: UmbracoNode,
  id: number,
): UmbracoNode | undefined {
  return flattenTree(root).find((n) => n.id === id);
}

// --- URL lookup ---

export function buildUrlLookup(root: UmbracoNode): Map<number, UmbracoUrl> {
  const map = new Map<number, UmbracoUrl>();
  for (const node of flattenTree(root)) {
    map.set(node.id, node.url);
  }
  return map;
}

// --- Culture helpers ---

/**
 * Resolve all localized fields on an object to a single culture.
 * Fields that have {nl, en, fr} keys get resolved to the value for the given culture.
 * Other fields pass through unchanged.
 */
/** A `{ nl, en, fr }` value reduced to one culture; anything else unchanged. */
type Localized<V> = V extends object ? ("nl" extends keyof V ? V["nl"] : V) : V;

/** `T` with every `{ nl, en, fr }` field replaced by the value for one culture. */
export type InCulture<T> = { [K in keyof T]: Localized<T[K]> };

export function pageInCulture<T extends Record<string, any>>(
  culture: Culture,
  page: T,
): InCulture<T> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(page)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).every((k) => k.length === 2)
    ) {
      result[key] = value[culture];
    } else {
      result[key] = value;
    }
  }
  return result as InCulture<T>;
}

/**
 * Build `getImage()` params from a CMS image URL.
 * Extracts `width` and `height` from the query string when available,
 * avoiding the extra network round-trip that `inferSize` requires.
 */
export function getImageParams(src: string): {
  src: string;
  width?: number;
  height?: number;
  inferSize?: boolean;
} {
  // The placeholder is a local public asset: no query string to parse and
  // `inferSize` only works for remote images, so give its own dimensions.
  if (src === MISSING_MEDIA) return { src, width: 1200, height: 600 };
  try {
    const url = new URL(src);
    const w = url.searchParams.get("width");
    const h = url.searchParams.get("height");
    if (w && h) {
      return { src, width: Number(w), height: Number(h) };
    }
  } catch {
    // not a valid URL, fall through
  }
  return { src, inferSize: true };
}

export function wrapIfSingleton<T>(a: T | T[] | null | undefined): T[] {
  if (!a) return [];
  return Array.isArray(a) ? a : [a];
}

/**
 * Strip the Umbraco `type` key from each property value so that localized
 * fields become clean `{ nl, en, fr }` objects — matching what Gatsby's
 * GraphQL layer produced. Without this, `pageInCulture` fails because the
 * extra `type` key (length 4) breaks the "all keys have length 2" heuristic.
 */
function stripPropertyTypes(
  properties: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      "type" in value
    ) {
      const { type, ...rest } = value;
      result[key] = rest;
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Convert an UmbracoNode into a flat data object (properties merged to top-level).
 */
export function nodeToEntry(node: UmbracoNode) {
  return {
    id: String(node.id),
    umbracoId: node.id,
    parentId: node.parentId,
    name: node.name,
    alias: node.alias,
    url: node.url,
    updateDate: node.updateDate,
    sortOrder: node.sortOrder,
    children: node.children,
    ...stripPropertyTypes(node.properties),
  };
}

// --- Media files (PDF brochures) ---

const PDF_URL = /^https?:\/\/[^/]+\/media\/(.+)\.pdf$/i;

/**
 * Local path for a backend PDF, served by `src/pages/downloads/[...file].pdf.ts`
 * so the built site does not depend on the backend. Other URLs pass through.
 */
export function mediaFileHref(remoteUrl: string): string {
  const m = remoteUrl.match(PDF_URL);
  return m ? `/downloads/${m[1]}.pdf` : remoteUrl;
}

/** Every distinct backend PDF referenced by any property in the tree. */
export function collectPdfUrls(root: UmbracoNode): string[] {
  const urls = new Set<string>();
  for (const node of flattenTree(root)) {
    for (const prop of Object.values(node.properties)) {
      if (!prop || typeof prop !== "object") continue;
      for (const value of Object.values(prop)) {
        if (typeof value === "string" && PDF_URL.test(value)) urls.add(value);
      }
    }
  }
  return [...urls];
}
