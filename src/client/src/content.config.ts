import { defineCollection, z } from "astro:content";
import { getTree, getNodesByAlias, nodeToEntry } from "./lib/umbraco";

const localizedString = z.object({
  nl: z.string(),
  en: z.string(),
  fr: z.string(),
});

const localizedOptionalString = z.object({
  nl: z.string().nullable().optional(),
  en: z.string().nullable().optional(),
  fr: z.string().nullable().optional(),
});

const localizedBoolean = z.object({
  nl: z.boolean(),
  en: z.boolean(),
  fr: z.boolean(),
});

// Header images use: mobile, tablet, desktop, large-desktop
const headerResponsiveImage = z.object({
  mobile: z.string(),
  tablet: z.string(),
  desktop: z.string(),
  "large-desktop": z.string(),
});

const localizedHeaderImage = z.object({
  nl: headerResponsiveImage,
  en: headerResponsiveImage,
  fr: headerResponsiveImage,
});

// Content images use: small, medium, tablet, desktop
const contentResponsiveImage = z.object({
  small: z.string(),
  medium: z.string(),
  tablet: z.string(),
  desktop: z.string(),
});

const localizedContentImage = z.object({
  nl: contentResponsiveImage.nullable(),
  en: contentResponsiveImage.nullable(),
  fr: contentResponsiveImage.nullable(),
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
    schema: baseSchema
      .extend({
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedString,
        title: localizedString,
        lead: localizedString,
        navigationText: localizedOptionalString.optional(),
        seoMetaDescription: localizedOptionalString.optional(),
        seoMetaKeywords: z
          .object({
            nl: z.array(z.string()).nullable().optional(),
            en: z.array(z.string()).nullable().optional(),
            fr: z.array(z.string()).nullable().optional(),
          })
          .optional(),
      })
      .passthrough(),
  }),
  aboutRow: defineCollection({
    loader: umbracoLoader("aboutRow"),
    schema: baseSchema
      .extend({
        image: localizedContentImage.optional(),
        imageRight: localizedBoolean.optional(),
        title: localizedString,
        aboveTitle: localizedOptionalString.optional(),
        lead: localizedOptionalString.optional(),
        linkText: localizedOptionalString.optional(),
        linkUrl: z
          .object({
            nl: z.number().nullable().optional(),
            en: z.number().nullable().optional(),
            fr: z.number().nullable().optional(),
          })
          .optional(),
        altText: localizedOptionalString.optional(),
        videoId: localizedOptionalString.optional(),
      })
      .passthrough(),
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
    schema: baseSchema
      .extend({
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedString,
        title: localizedString,
        lead: localizedString,
        navigationText: localizedOptionalString.optional(),
        seoMetaDescription: localizedOptionalString.optional(),
        seoMetaKeywords: z
          .object({
            nl: z.array(z.string()).nullable().optional(),
            en: z.array(z.string()).nullable().optional(),
            fr: z.array(z.string()).nullable().optional(),
          })
          .optional(),
      })
      .passthrough(),
  }),
  teamMember: defineCollection({
    loader: umbracoLoader("teamMember"),
    schema: baseSchema
      .extend({
        firstName: localizedString,
        lastName: localizedString,
        function: localizedString,
        photo: z.object({
          nl: z.object({ main: z.string() }).nullable(),
          en: z.object({ main: z.string() }).nullable(),
          fr: z.object({ main: z.string() }).nullable(),
        }),
      })
      .passthrough(),
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
