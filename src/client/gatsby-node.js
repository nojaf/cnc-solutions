const path = require(`path`)
const fetch = require("node-fetch")
const R = require("ramda")
const signalR = require("signalr-client")

// Helper function to fetch data
const fetchData = async (url, options = {}) => {
  const response = await fetch(`${url}`, options)
  return await response.json()
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allCulture {
        edges {
          node {
            value
          }
        }
      }
      home {
        umbracoId
        url {
          nl
          en
          fr
        }
        seoMetaDescription {
          nl
          en
          fr
        }
        seoMetaKeywords {
          nl
          en
          fr
        }
        title: navigationText {
          nl
          en
          fr
        }
      }
      allAbout {
        edges {
          node {
            umbracoId
            url {
              nl
              en
              fr
            }
            seoMetaDescription {
              nl
              en
              fr
            }
            seoMetaKeywords {
              nl
              en
              fr
            }
            title: navigationText {
              nl
              en
              fr
            }
          }
        }
      }
      contact {
        umbracoId
        url {
          nl
          en
          fr
        }
        seoMetaDescription {
          nl
          en
          fr
        }
        seoMetaKeywords {
          nl
          en
          fr
        }
        title: navigationText {
          nl
          en
          fr
        }
      }
      solutions {
        umbracoId
        url {
          nl
          en
          fr
        }
        seoMetaDescription {
          nl
          en
          fr
        }
        seoMetaKeywords {
          nl
          en
          fr
        }
        title: navigationText {
          nl
          en
          fr
        }
      }
      allSolution {
        edges {
          node {
            umbracoId
            url {
              nl
              en
              fr
            }
            seoMetaDescription {
              nl
              en
              fr
            }
            seoMetaKeywords {
              nl
              en
              fr
            }
            title: navigationText {
              nl
              en
              fr
            }
          }
        }
      }
      products {
        umbracoId
        url {
          nl
          en
          fr
        }
        seoMetaDescription {
          nl
          en
          fr
        }
        seoMetaKeywords {
          nl
          en
          fr
        }
        title: navigationText {
          nl
          en
          fr
        }
      }
      allProduct {
        edges {
          node {
            umbracoId
            url {
              nl
              en
              fr
            }
            seoMetaDescription {
              nl
              en
              fr
            }
            seoMetaKeywords {
              nl
              en
              fr
            }
            title: navigationText {
              nl
              en
              fr
            }
          }
        }
      }
    }
  `)

  const {
    home,
    allAbout,
    contact,
    solutions,
    products,
    allCulture,
    allSolution,
    allProduct
  } = result.data
  const cultures = R.map(
    R.pipe(R.prop("node"), R.prop("value")),
    allCulture.edges
  )
  const solutionItems = allSolution.edges.map(({ node }) => node)
  const productItems = allProduct.edges.map(({ node }) => node)
  const aboutPages = allAbout.edges.map(({ node }) => node)

  cultures.forEach(culture => {
    const selectSEO = page => {
      return {
        description: page.seoMetaDescription[culture],
        keywords: page.seoMetaKeywords[culture],
        title: page.title[culture],
        lang: culture,
      }
    }

    // index
    createPage({
      path: home.url[culture],
      component: path.resolve(`./src/templates/index.js`),
      context: {
        culture,
        umbracoId: home.umbracoId,
        seo: selectSEO(home),
      },
    })

    // solutions
    createPage({
      path: solutions.url[culture],
      component: path.resolve(`./src/templates/solutions.js`),
      context: {
        culture,
        umbracoId: solutions.umbracoId,
        seo: selectSEO(solutions),
      },
    })

    // solution
    solutionItems.forEach(solution => {
      createPage({
        path: solution.url[culture],
        component: path.resolve(`./src/templates/solution.js`),
        context: {
          culture,
          umbracoId: solution.umbracoId,
          seo: selectSEO(solution),
        },
      })
    })

    // products
    createPage({
      path: products.url[culture],
      component: path.resolve(`./src/templates/products.js`),
      context: {
        culture,
        umbracoId: products.umbracoId,
        seo: selectSEO(products),
      },
    })

    // product
    productItems.forEach(product => {
      createPage({
        path: product.url[culture],
        component: path.resolve(`./src/templates/product.js`),
        context: {
          culture,
          umbracoId: product.umbracoId,
          seo: selectSEO(product),
        },
      })
    })

    // about pages
    aboutPages.forEach(about => {
      createPage({
        path: about.url[culture],
        component: path.resolve(`./src/templates/about.js`),
        context: {
          culture,
          umbracoId: about.umbracoId,
          seo: selectSEO(about),
        },
      })
    })

    // contact
    createPage({
      path: contact.url[culture],
      component: path.resolve(`./src/templates/contact.js`),
      context: {
        culture,
        umbracoId: contact.umbracoId,
        seo: selectSEO(contact),
      },
    })
  })
}

// exports.createResolvers = ({ createResolvers }) => {
//   return fetchData(
//     "https://cncsolutions-backend.azurewebsites.net/umbraco/api/graph/tree"
//   ).then(tree => {
//     const lookup = mapDataToNodeLookup(tree)
//     const resolvers = {
//       Query: {
//         urlLookUp: {
//           type:""
//         },
//         linkToNode: {
//           type: "String",
//           args: {
//             culture: "String!",
//             id: "Int!",
//           },
//           resolve(source, args, context, info) {
//             return lookup[args.id][args.culture]
//           },
//         },
//       },
//     }
//     createResolvers(resolvers)
//   })
// }

function mapDataToNodeLookup(tree) {
  function parseNode(node) {
    const currentNode = R.pickAll(["id", "url"])(node)
    const childNodes = node.children.map(parseNode)
    return [currentNode, ...childNodes]
  }

  return R.pipe(parseNode, R.flatten)(tree.root)
}

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions
  const urlNodePromise = fetchData(
    "https://cncsolutions-backend.azurewebsites.net/umbraco/api/graph/tree"
  ).then(tree => {
    const lookup = mapDataToNodeLookup(tree)
    lookup.forEach(l => {
      const node = {
        id: createNodeId(`UmbracoUrl-${l.id}`),
        children: [],
        parent: null,
        internal: {
          type: "UmbracoUrl",
          content: JSON.stringify(l),
          contentDigest: createContentDigest(l),
        },
        umbracoId: l.id,
        url: l.url,
      }
      createNode(node)
    })
  })

  const resolveUmbracoNode = id => {
    const url = id
      ? `https://cncsolutions-backend.azurewebsites.net/umbraco/api/graph/byid/${id}`
      : "https://cncsolutions-backend.azurewebsites.net/umbraco/api/graph/tree"
    const processNode = umbracoNode => {
      const gatsbyNode = Object.assign(
        {
          umbracoId: umbracoNode.id,
          parentUmbracoId: umbracoNode.parentId,
          name: umbracoNode.name,
          url: umbracoNode.url,
          updateDate: umbracoNode.updateDate,
        },
        umbracoNode.properties,
        {
          id: createNodeId(`UmbracoId-${umbracoNode.id}`),
          children: umbracoNode.children.map(({ id }) =>
            createNodeId(`UmbracoId-${id}`)
          ),
          parent:
            umbracoNode.parentId &&
            createNodeId(`UmbracoId-${umbracoNode.parentId}`),
          internal: {
            type: umbracoNode.alias,
            content: JSON.stringify(umbracoNode),
            contentDigest: createContentDigest(umbracoNode),
          },
        }
      )
      createNode(gatsbyNode)
      umbracoNode.children.forEach(processNode)
    }

    const processCulture = culture => {
      const gatsbyNode = {
        id: createNodeId(`Culture-${culture}`),
        value: culture,
        children: [],
        parent: null,
        internal: {
          type: "Culture",
          content: JSON.stringify(culture),
          contentDigest: createContentDigest(culture),
        },
      }
      createNode(gatsbyNode)
    }

    return fetchData(url).then(result => {
      result.cultures.forEach(processCulture)
      processNode(result.root)
    })
  }

  const client = new signalR.client(
    //signalR service URL
    "wss://cncsolutions-backend.azurewebsites.net/umbraco/backoffice/signalr/hubs",
    // array of hubs to be supported in the connection
    ["GatsbyHub"]
  )

  client.on("GatsbyHub", "nodePublished", e => {
    console.log(`SIGNALR NODE PUBLISHED`, e)
    return resolveUmbracoNode(e)
  })

  const rootUmbracoNodePromise = resolveUmbracoNode(null)

  return Promise.all([urlNodePromise, rootUmbracoNodePromise])
}
