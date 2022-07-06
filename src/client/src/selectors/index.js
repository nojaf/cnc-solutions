import { graphql, useStaticQuery } from "gatsby"

import * as R from "ramda"

export function pageInCulture(culture, page) {
  const mapCultureKey = (k) => ({ [k]: page[k][culture] })
  const allKeys = Object.keys(page)
  const cultureKeys = allKeys.filter(
    (k) =>
      R.is(Object, page[k]) &&
      Object.keys(page[k]).every((pk) => pk.length === 2)
  )
  const nonCultureKeys = R.without(cultureKeys, allKeys)

  const cultureKeyValues = R.map(mapCultureKey, cultureKeys)
  const nonCultureKeyValues = R.map((k) => ({ [k]: page[k] }), nonCultureKeys)

  return R.mergeAll([...cultureKeyValues, ...nonCultureKeyValues])
}

function useUmbracoUrls() {
  const allUrls = useStaticQuery(graphql`
    query getUrl {
      data: allUmbracoUrl {
        edges {
          node {
            umbracoId
            url {
              nl
              en
              fr
            }
          }
        }
      }
    }
  `)
  return allUrls
}

export function useUrl(culture, umbracoId) {
  const allUrls = useUmbracoUrls()
  const mapNode = ({ node }) => ({ [node.umbracoId]: node.url[culture] })
  const lookup = R.mergeAll(R.map(mapNode, allUrls.data.edges))
  return lookup[umbracoId]
}

export function useUrlsForPage(umbracoId) {
  const allUrls = useUmbracoUrls()
  const mapNode = ({ node }) => ({ [node.umbracoId]: node.url })
  const lookup = R.mergeAll(R.map(mapNode, allUrls.data.edges))
  return lookup[umbracoId]
}
