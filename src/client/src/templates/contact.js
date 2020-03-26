import Layout from "../components/layout"
import React from "react"
import { graphql } from "gatsby"
import Header from "../components/header"
import underlineWhite from "../images/underline-white.png"
import { pageInCulture } from "../selectors"

const BelowHeader = ({ aboveTitle, title }) => {
  return (
    <section>
      <div className="container">
        <div className="text-center mt-5 mb-2">
          <h2 className="above">{aboveTitle}</h2>
          <div className="title-container">
            <h1 className="mb-0">{title}</h1>
            <img
              src={underlineWhite}
              className="underline-bar"
              alt={"underline-bar"}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

const ContactForm = ({
  labelName,
  labelCompany,
  labelAddress,
  labelZip,
  labelCity,
  labelCountry,
  labelEmail,
  labelPhone,
  labelMessage,
  sendButtonText,
  successText,
  errorText,
  aboveForm,
}) => {
  return (
    <div id="contact-form" className="col-12 col-lg-8">
      <div className="container">
        <h2>{aboveForm}</h2>
        <form action="#" method="post">
          <div className="form-group">
            <label htmlFor="name">{labelName}*</label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">{labelCompany}*</label>
            <input
              type="text"
              name="company"
              id="company"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">{labelAddress}</label>
            <input
              type="text"
              name="address"
              id="address"
              className="form-control"
            />
          </div>
          <div className="row">
            <div className="form-group col-6">
              <label htmlFor="zip">{labelZip}</label>
              <input type="text" name="zip" id="zip" className="form-control" />
            </div>
            <div className="form-group col-6">
              <label htmlFor="city">{labelCity}</label>
              <input
                type="text"
                name="city"
                id="city"
                className="form-control"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="country">{labelCountry}</label>
            <input
              type="text"
              name="country"
              id="country"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{labelEmail}*</label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telephone">{labelPhone}*</label>
            <input
              type="tel"
              name="telephone"
              id="telephone"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">{labelMessage}</label>
            <textarea
              name="message"
              id="message"
              cols={30}
              rows={5}
              className="form-control"
              defaultValue={""}
            />
          </div>
          <div className="submit-container">
            <button type="submit" className="btn-outline-primary">
              {sendButtonText}
              <span className="corner" />
              <span className="inner-corner" />
            </button>
          </div>
        </form>
        <div id="success" className="d-none alert alert-success">
          {successText}
        </div>
        <div id="error" className="d-none alert alert-danger">
          {errorText}
        </div>
      </div>
    </div>
  )
}

const ContactInfo = ({
  aboveAddress,
  address,
  email,
  phone,
  linkedInUrl,
  facebookUrl,
}) => {
  return (
    <div id="contact-info" className="col-12 col-lg-4">
      <h2>{aboveAddress}</h2>
      <address>
        <pre>{address}</pre>
      </address>
      <dl>
        {email && (
          <>
            <dt>
              <i className="far fa-envelope mr-1" />
            </dt>
            <dd>{email}</dd>
          </>
        )}
        {phone && (
          <>
            <dt>
              <i className="fas fa-phone-alt mr-1" />
            </dt>
            <dd>{phone}</dd>
          </>
        )}
        {linkedInUrl && (
          <>
            <dt>
              <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin" />
              </a>
            </dt>
            <dd />
          </>
        )}
        {facebookUrl && (
          <>
            <dt>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-square" />
              </a>
            </dt>
          </>
        )}
        <dd />
      </dl>
    </div>
  )
}

export default ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const contact = pageInCulture(currentCulture, data.contact)

  return (
    <Layout culture={currentCulture} currentPageId={pageContext.umbracoId}>
      <Header currentPage={contact} />
      <BelowHeader {...contact} />
      <section className="container">
        <div className="row">
          <ContactInfo {...contact} />
          <ContactForm {...contact} />
        </div>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query {
    contact {
      id
      name
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
        en
        nl
      }
      title {
        en
        nl
      }
      labelAddress {
        en
        nl
      }
      labelCity {
        en
        nl
      }
      labelCompany {
        en
        nl
      }
      labelCountry {
        en
        nl
      }
      labelMessage {
        en
        nl
      }
      labelEmail {
        en
        nl
      }
      labelName {
        en
        nl
      }
      labelPhone {
        en
        nl
      }
      labelZip {
        en
        nl
      }
      aboveAddress {
        en
        nl
      }
      address {
        en
        nl
      }
      email {
        en
        nl
      }
      phone {
        en
        nl
      }
      errorText {
        nl
        en
      }
      facebookUrl {
        en
        nl
      }
      linkedInUrl {
        en
        nl
      }
      sendButtonText {
        en
        nl
      }
      successText {
        en
        nl
      }
      errorText {
        en
        nl
      }
    }
  }
`
