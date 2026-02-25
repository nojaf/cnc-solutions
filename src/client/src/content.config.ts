import { defineCollection, z } from "astro:content";
import { getTree, getNodesByAlias, nodeToEntry } from "./lib/umbraco";

const localizedString = z.object({
  nl: z.string(),
  en: z.string(),
  fr: z.string(),
});

// Shared fields present on every page-level node
const baseSchema = z.object({
  umbracoId: z.number(),
  parentId: z.number().nullable(),
  name: z.string(),
  alias: z.string(),
  url: localizedString,
  updateDate: z.string(),
  sortOrder: z.number(),
});

function umbracoLoader(alias: string) {
  return async () => {
    const tree = await getTree();
    const nodes =
      alias === "home" ? [tree.root] : getNodesByAlias(tree.root, alias);
    return nodes.map(nodeToEntry);
  };
}

// --- Page-level collections ---

export const collections = {
  home: defineCollection({
    loader: umbracoLoader("home"),
    schema: baseSchema.passthrough(),
  }),
  about: defineCollection({
    loader: umbracoLoader("about"),
    schema: baseSchema.passthrough(),
  }),
  aboutRow: defineCollection({
    loader: umbracoLoader("aboutRow"),
    schema: baseSchema.passthrough(),
  }),
  contact: defineCollection({
    loader: umbracoLoader("contact"),
    schema: baseSchema.passthrough(),
  }),
  solutions: defineCollection({
    loader: umbracoLoader("solutions"),
    schema: baseSchema.passthrough(),
  }),
  solution: defineCollection({
    loader: umbracoLoader("solution"),
    schema: baseSchema.passthrough(),
  }),
  products: defineCollection({
    loader: umbracoLoader("products"),
    schema: baseSchema.passthrough(),
  }),
  product: defineCollection({
    loader: umbracoLoader("product"),
    schema: baseSchema.passthrough(),
  }),
  cases: defineCollection({
    loader: umbracoLoader("cases"),
    schema: baseSchema.passthrough(),
  }),
  case: defineCollection({
    loader: umbracoLoader("case"),
    schema: baseSchema.passthrough(),
  }),
  team: defineCollection({
    loader: umbracoLoader("team"),
    schema: baseSchema.passthrough(),
  }),
  news: defineCollection({
    loader: umbracoLoader("news"),
    schema: baseSchema.passthrough(),
  }),
  newsPage: defineCollection({
    loader: umbracoLoader("newsPage"),
    schema: baseSchema.passthrough(),
  }),
};
