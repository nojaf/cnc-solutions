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

// Thumbnail images use: mobile, tablet, desktop
const thumbnailResponsiveImage = z.object({
  mobile: z.string(),
  tablet: z.string(),
  desktop: z.string(),
});

const localizedThumbnailImage = z.object({
  nl: thumbnailResponsiveImage.nullable(),
  en: thumbnailResponsiveImage.nullable(),
  fr: thumbnailResponsiveImage.nullable(),
});

// Slide / homeRow images use: phone, tablet, desktop, largeDesktop
const slideResponsiveImage = z.object({
  phone: z.string(),
  tablet: z.string(),
  desktop: z.string(),
  largeDesktop: z.string(),
});

const localizedSlideImage = z.object({
  nl: slideResponsiveImage.nullable(),
  en: slideResponsiveImage.nullable(),
  fr: slideResponsiveImage.nullable(),
});

// Overview thumbnails (solutions / cases) provide homepage and overview crops
const overviewThumbnail = z.object({
  "homepage mobile": z.string(),
  "homepage tablet": z.string(),
  "homepage desktop": z.string(),
  "homepage large desktop": z.string(),
  "overview mobile": z.string(),
  "overview tablet portrait": z.string(),
  "overview tablet landscape": z.string(),
  "overview desktop": z.string(),
  "overview large desktop": z.string(),
});

const localizedOverviewThumbnail = z.object({
  nl: overviewThumbnail,
  en: overviewThumbnail,
  fr: overviewThumbnail,
});

// Product thumbnails provide mobile, desktop and large-desktop crops
const productThumbnail = z.object({
  mobile: z.string(),
  desktop: z.string(),
  "large-desktop": z.string(),
});

const localizedProductThumbnail = z.object({
  nl: productThumbnail,
  en: productThumbnail,
  fr: productThumbnail,
});

// Solution slideshow images use: mobile-portrait, mobile-landscape, tablet, desktop, large-desktop
const slideshowResponsiveImage = z.object({
  "mobile-portrait": z.string(),
  "mobile-landscape": z.string(),
  tablet: z.string(),
  desktop: z.string(),
  "large-desktop": z.string(),
});

const localizedSlideshowImage = z.object({
  nl: slideshowResponsiveImage,
  en: slideshowResponsiveImage,
  fr: slideshowResponsiveImage,
});

const localizedNumber = z.object({
  nl: z.number(),
  en: z.number(),
  fr: z.number(),
});

// Shared fields of every block on a solution detail page
const solutionBlockFields = {
  row: localizedNumber,
  isRight: localizedBoolean,
  color: localizedOptionalString,
};

const localizedKeywords = z.object({
  nl: z.array(z.string()).nullable().optional(),
  en: z.array(z.string()).nullable().optional(),
  fr: z.array(z.string()).nullable().optional(),
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
  homeRow: defineCollection({
    loader: umbracoLoader("homeRow"),
    schema: baseSchema
      .extend({
        theme: localizedOptionalString.optional(),
        aboveTitle: localizedOptionalString.optional(),
        title: localizedString,
        lead: localizedOptionalString.optional(),
        linkText: localizedOptionalString.optional(),
        linkNode: z
          .object({
            nl: z.number().nullable().optional(),
            en: z.number().nullable().optional(),
            fr: z.number().nullable().optional(),
          })
          .optional(),
        imageRight: localizedBoolean.optional(),
        image: localizedSlideImage.optional(),
        altText: localizedOptionalString.optional(),
        videoId: localizedOptionalString.optional(),
        fileDownloadFile: localizedOptionalString.optional(),
      })
      .passthrough(),
  }),
  contact: defineCollection({
    loader: umbracoLoader("contact"),
    schema: baseSchema
      .extend({
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedString,
        title: localizedString,
        aboveAddress: localizedOptionalString.optional(),
        address: localizedOptionalString.optional(),
        email: localizedOptionalString.optional(),
        phone: localizedOptionalString.optional(),
        linkedInUrl: localizedOptionalString.optional(),
        facebookUrl: localizedOptionalString.optional(),
        aboveForm: localizedOptionalString.optional(),
        labelName: localizedOptionalString.optional(),
        labelCompany: localizedOptionalString.optional(),
        labelAddress: localizedOptionalString.optional(),
        labelZip: localizedOptionalString.optional(),
        labelCity: localizedOptionalString.optional(),
        labelCountry: localizedOptionalString.optional(),
        labelEmail: localizedOptionalString.optional(),
        labelPhone: localizedOptionalString.optional(),
        labelMessage: localizedOptionalString.optional(),
        sendButtonText: localizedOptionalString.optional(),
        successText: localizedOptionalString.optional(),
        errorText: localizedOptionalString.optional(),
        turnstileSiteKey: localizedString,
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
  solutions: defineCollection({
    loader: umbracoLoader("solutions"),
    schema: baseSchema
      .extend({
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedString,
        title: localizedString,
        lead: localizedString,
        navigationText: localizedOptionalString.optional(),
        seoMetaDescription: localizedOptionalString.optional(),
        seoMetaKeywords: localizedKeywords.optional(),
      })
      .passthrough(),
  }),
  solution: defineCollection({
    loader: umbracoLoader("solution"),
    schema: baseSchema
      .extend({
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedString,
        title: localizedString,
        lead: localizedString,
        thumbnail: localizedOverviewThumbnail,
        thumbnailAlt: localizedString,
        icon: localizedString,
        navigationText: localizedOptionalString.optional(),
        seoMetaDescription: localizedOptionalString.optional(),
        seoMetaKeywords: localizedKeywords.optional(),
      })
      .passthrough(),
  }),
  solutionSlideshow: defineCollection({
    loader: umbracoLoader("solutionSlideshow"),
    schema: baseSchema.extend(solutionBlockFields).passthrough(),
  }),
  solutionSlideshowImage: defineCollection({
    loader: umbracoLoader("solutionSlideshowImage"),
    schema: baseSchema
      .extend({
        image: localizedSlideshowImage,
        altText: localizedOptionalString.optional(),
      })
      .passthrough(),
  }),
  solutionText: defineCollection({
    loader: umbracoLoader("solutionText"),
    schema: baseSchema
      .extend({
        ...solutionBlockFields,
        aboveTitle: localizedOptionalString.optional(),
        title: localizedString,
        lead: localizedOptionalString.optional(),
      })
      .passthrough(),
  }),
  solutionVideo: defineCollection({
    loader: umbracoLoader("solutionVideo"),
    schema: baseSchema
      .extend({
        ...solutionBlockFields,
        videoId: localizedOptionalString.optional(),
      })
      .passthrough(),
  }),
  products: defineCollection({
    loader: umbracoLoader("products"),
    schema: baseSchema
      .extend({
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedString,
        title: localizedString,
        lead: localizedString,
        productDetailType: localizedString,
        productDetailLinkText: localizedString,
        variants: localizedString,
        application: localizedString,
        navigationText: localizedOptionalString.optional(),
        seoMetaDescription: localizedOptionalString.optional(),
        seoMetaKeywords: localizedKeywords.optional(),
      })
      .passthrough(),
  }),
  product: defineCollection({
    loader: umbracoLoader("product"),
    schema: baseSchema
      .extend({
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedString,
        title: localizedString,
        lead: localizedString,
        type: localizedString,
        variants: localizedString,
        application: localizedString,
        thumbnail: localizedProductThumbnail,
        aboveFeature: localizedString,
        featureTitle: localizedString,
        aboveMoreInfo: localizedString,
        moreInfoTitle: localizedString,
        moreInfoLead: localizedOptionalString.optional(),
        fileDownloadFile: localizedOptionalString.optional(),
        fileDownloadText: localizedOptionalString.optional(),
        contactPageLink: localizedNumber.nullable().optional(),
        contactPageText: localizedOptionalString.optional(),
        navigationText: localizedOptionalString.optional(),
        seoMetaDescription: localizedOptionalString.optional(),
        seoMetaKeywords: localizedKeywords.optional(),
      })
      .passthrough(),
  }),
  productRow: defineCollection({
    loader: umbracoLoader("productRow"),
    schema: baseSchema
      .extend({
        image: localizedThumbnailImage,
        altText: localizedOptionalString.optional(),
        isMediaRight: localizedBoolean,
        videoId: localizedOptionalString.optional(),
        aboveTitle: localizedOptionalString.optional(),
        title: localizedString,
        lead: localizedOptionalString.optional(),
      })
      .passthrough(),
  }),
  productFeature: defineCollection({
    loader: umbracoLoader("productFeature"),
    schema: baseSchema
      .extend({
        icon: localizedString,
        title: localizedString,
        lead: localizedOptionalString.optional(),
      })
      .passthrough(),
  }),
  cases: defineCollection({
    loader: umbracoLoader("cases"),
    schema: baseSchema
      .extend({
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedString,
        title: localizedString,
        lead: localizedString,
        navigationText: localizedOptionalString.optional(),
        seoMetaDescription: localizedOptionalString.optional(),
        seoMetaKeywords: localizedKeywords.optional(),
      })
      .passthrough(),
  }),
  case: defineCollection({
    loader: umbracoLoader("case"),
    schema: baseSchema
      .extend({
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedString,
        title: localizedString,
        lead: localizedString,
        thumbnail: localizedOverviewThumbnail,
        thumbnailAlt: localizedString,
        thumbnailText: localizedOptionalString.optional(),
        navigationText: localizedOptionalString.optional(),
        seoMetaDescription: localizedOptionalString.optional(),
        seoMetaKeywords: localizedKeywords.optional(),
      })
      .passthrough(),
  }),
  caseRow: defineCollection({
    loader: umbracoLoader("caseRow"),
    schema: baseSchema
      .extend({
        aboveTitle: localizedOptionalString.optional(),
        title: localizedString,
        lead: localizedOptionalString.optional(),
        isMediaRight: localizedBoolean,
        videoId: localizedOptionalString.optional(),
        linkUrl: z
          .object({
            nl: z.number().nullable().optional(),
            en: z.number().nullable().optional(),
            fr: z.number().nullable().optional(),
          })
          .optional(),
        linkText: localizedOptionalString.optional(),
      })
      .passthrough(),
  }),
  caseSlideshowImage: defineCollection({
    loader: umbracoLoader("caseSlideshowImage"),
    schema: baseSchema
      .extend({
        image: localizedThumbnailImage,
        altText: localizedOptionalString.optional(),
      })
      .passthrough(),
  }),
  quoteRow: defineCollection({
    loader: umbracoLoader("quoteRow"),
    schema: baseSchema
      .extend({
        quote: localizedString,
        clientName: localizedOptionalString.optional(),
      })
      .passthrough(),
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
    schema: baseSchema
      .extend({
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedOptionalString.optional(),
        title: localizedString,
        lead: localizedOptionalString.optional(),
        readMoreText: localizedString,
        previousNewsLinkText: localizedOptionalString.optional(),
        nextNewsLinkText: localizedOptionalString.optional(),
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
  newsPage: defineCollection({
    loader: umbracoLoader("newsPage"),
    schema: baseSchema
      .extend({
        title: localizedString,
        publicationDate: localizedString,
        headerImage: localizedHeaderImage,
        headerImageAlt: localizedString,
        aboveTitle: localizedOptionalString.optional(),
        lead: localizedOptionalString.optional(),
        thumbnail: localizedThumbnailImage,
        overviewLead: localizedOptionalString.optional(),
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
  newsText: defineCollection({
    loader: umbracoLoader("newsText"),
    schema: baseSchema
      .extend({
        content: localizedOptionalString.optional(),
      })
      .passthrough(),
  }),
  newsImage: defineCollection({
    loader: umbracoLoader("newsImage"),
    schema: baseSchema
      .extend({
        image: localizedOptionalString.optional(),
        altText: localizedOptionalString.optional(),
        caption: localizedOptionalString.optional(),
        isFullWidth: localizedBoolean.optional(),
      })
      .passthrough(),
  }),
  newsVideo: defineCollection({
    loader: umbracoLoader("newsVideo"),
    schema: baseSchema
      .extend({
        videoId: localizedOptionalString.optional(),
      })
      .passthrough(),
  }),
};
