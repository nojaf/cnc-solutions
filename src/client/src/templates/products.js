import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { pageInCulture } from "../selectors"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"

const ProductCarouselSlide = ({
  productDetailLinkText,
  productDetailType,
  variantsLabel,
  applicationLabel,
  type,
  variants,
  application,
  thumbnail,
  url,
  productTitle,
  isActive,
}) => {
  const { mobile } = thumbnail
  return (
    <div className={`carousel-item ${isActive ? "active" : ""}`}>
      <div className="product">
        <Link to={url} className={"header"}>
          <img
            src={mobile}
            className="d-block m-auto"
            srcSet={mobile}
            alt={""}
          />
          <h2 className="title">{productTitle}</h2>
        </Link>
        <div className="content">
          <h3>{productDetailType}</h3>
          <p>{type}</p>
          <h3>{variantsLabel}</h3>
          <p>{variants}</p>
          <h3>{applicationLabel}</h3>
          <p>{application}</p>
          <div className="corner" />
        </div>
        <Link to={url} className="more-info">
          {productDetailLinkText}
          <span className="corner" />
          <span className="inner-corner" />
        </Link>
      </div>
    </div>
  )
}

const Product = ({
  productTitle,
  productDetailLinkText,
  productDetailType,
  variantsLabel,
  applicationLabel,
  type,
  variants,
  application,
  thumbnail,
  url,
}) => {
  const { desktop, large_desktop } = thumbnail
  return (
    <div className="product">
      <Link to={url} className="header">
        <picture>
          <source media="(min-width: 75em)" srcSet={large_desktop} />
          <img
            src={desktop}
            className="d-block m-auto"
            srcSet={desktop}
            alt={""}
          />
        </picture>
        <h2 className="title">{productTitle}</h2>
      </Link>
      <div className="content">
        <h3>{productDetailType}</h3>
        <p>{type}</p>
        <h3>{variantsLabel}</h3>
        <p>{variants}</p>
        <h3>{applicationLabel}</h3>
        <p>{application}</p>
        <div className="corner" />
      </div>
      <Link to={url} className={"more-info"}>
        {productDetailLinkText}
        <span className="corner" />
        <span className="inner-corner" />
      </Link>
    </div>
  )
}

export default ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const products = pageInCulture(currentCulture, data.products)
  const productItems = data.allProduct.edges.map(({ node }) => {
    return pageInCulture(currentCulture, node)
  })

  return (
    <Layout culture={pageContext.culture} currentPageId={pageContext.umbracoId}>
      <Header currentPage={products} />
      <PageIntroduction {...products} />
      <section>
        <div className="container">
          <div id="products">
            <div
              id="products-carousel"
              className="carousel slide d-md-none"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                {productItems.map((pi, index) => (
                  <ProductCarouselSlide
                    {...products}
                    {...pi}
                    isActive={index === 0}
                  />
                ))}
              </div>
              <a
                className="carousel-control-prev"
                href="#products-carousel"
                role="button"
                data-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#products-carousel"
                role="button"
                data-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="sr-only">Next</span>
              </a>
            </div>
            <div id="products-grid">
              {productItems.map(pi => (
                <Product {...products} {...pi} />
              ))}
            </div>
          </div>
        </div>
        <div className="edge-container w-100">
          <div className="edge"></div>
        </div>
      </section>
    </Layout>
  )
}
export const query = graphql`
  query {
    products {
      url {
        nl
        en
      }
      id
      headerImage {
        nl {
          mobile
          tablet
          desktop
          large_desktop
        }
        en {
          mobile
          tablet
          desktop
          large_desktop
        }
      }
      headerImageAlt {
        en
        nl
      }
      aboveTitle {
        nl
        en
      }
      title {
        nl
        en
      }
      lead {
        nl
        en
      }
      productDetailType {
        nl
        en
      }
      productDetailLinkText {
        nl
        en
      }
      variantsLabel: variants {
        nl
        en
      }
      applicationLabel: application {
        nl
        en
      }
    }
    allProduct {
      edges {
        node {
          key: umbracoId
          url {
            en
            nl
          }
          type {
            nl
            en
          }
          application {
            en
            nl
          }
          variants {
            en
            nl
          }
          lead {
            nl
            en
          }
          productTitle: aboveTitle {
            en
            nl
          }
          thumbnail {
            nl {
              mobile
              desktop
              large_desktop
            }
            en {
              mobile
              desktop
              large_desktop
            }
          }
        }
      }
    }
  }
`
