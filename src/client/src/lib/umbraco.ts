const API_BASE = "https://cncsolutions-backend.azurewebsites.net/umbraco/api";

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

let cachedTree: UmbracoTree | null = null;

export async function getTree(): Promise<UmbracoTree> {
  if (!cachedTree) {
    const response = await fetch(`${API_BASE}/graph/tree`);
    cachedTree = await response.json();
  }
  return cachedTree!;
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
export function pageInCulture<T extends Record<string, any>>(
  culture: Culture,
  page: T,
): Record<string, any> {
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
  return result;
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
