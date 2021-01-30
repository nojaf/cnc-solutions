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

const requiredFields = ["name", "company", "email", "telephone"]

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
  const [form, setForm] = React.useState({
    name: "",
    company: "",
    address: "",
    zip: "",
    city: "",
    country: "",
    email: "",
    telephone: "",
    message: "",
  })

  const [didSubmit, setDidSubmit] = React.useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false)
  const [showErrorMessage, setShowErrorMessage] = React.useState(false)

  const updateValue = key => ev => {
    const value = ev.target.value
    setForm(prevState => {
      return { ...prevState, [key]: value }
    })
  }

  const handleSubmit = ev => {
    ev.preventDefault()
    setDidSubmit(true)
    setShowSuccessMessage(false)
    setShowErrorMessage(false)
    if (requiredFields.every(rf => !!form[rf])) {
      fetch(
        "https://cncsolutions-backend.azurewebsites.net/umbraco/api/contact/post",
        {
          method: "POST",
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify(form),
        }
      )
        .then(respone => {
          console.log(`Response: ${respone.status}`)
          setShowSuccessMessage(true)
        })
        .catch(err => {
          setShowErrorMessage(true)
        })
    }
  }

  const formClass = key => {
    if (requiredFields.indexOf(key) !== -1 && !form[key] && didSubmit) {
      return `form-control is-invalid`
    } else {
      return `form-control`
    }
  }

  return (
    <div id="contact-form" className="col-12 col-lg-8">
      <div className="container">
        <h2>{aboveForm}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{labelName}*</label>
            <input
              type="text"
              name="name"
              className={formClass("name")}
              id="name"
              required
              value={form.name}
              onChange={updateValue("name")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">{labelCompany}*</label>
            <input
              type="text"
              name="company"
              id="company"
              className={formClass("company")}
              required
              value={form.company}
              onChange={updateValue("company")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">{labelAddress}</label>
            <input
              type="text"
              name="address"
              id="address"
              className={formClass("address")}
              value={form.address}
              onChange={updateValue("address")}
            />
          </div>
          <div className="row">
            <div className="form-group col-6">
              <label htmlFor="zip">{labelZip}</label>
              <input
                type="text"
                name="zip"
                id="zip"
                className={formClass("zip")}
                value={form.zip}
                onChange={updateValue("zip")}
              />
            </div>
            <div className="form-group col-6">
              <label htmlFor="city">{labelCity}</label>
              <input
                type="text"
                name="city"
                id="city"
                className={formClass("city")}
                value={form.city}
                onChange={updateValue("city")}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="country">{labelCountry}</label>
            <input
              type="text"
              name="country"
              id="country"
              className={formClass("country")}
              value={form.country}
              onChange={updateValue("country")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{labelEmail}*</label>
            <input
              type="email"
              name="email"
              id="email"
              className={formClass("email")}
              required
              value={form.email}
              onChange={updateValue("email")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telephone">{labelPhone}*</label>
            <input
              type="tel"
              name="telephone"
              id="telephone"
              className={formClass("telephone")}
              required
              value={form.phone}
              onChange={updateValue("telephone")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">{labelMessage}</label>
            <textarea
              name="message"
              id="message"
              cols={30}
              rows={5}
              className={formClass("message")}
              defaultValue={form.message}
              onChange={updateValue("message")}
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
        {showSuccessMessage && (
          <div id="success" className="alert alert-success">
            {successText}
          </div>
        )}
        {showErrorMessage && (
          <div id="error" className="alert alert-danger">
            {errorText}
          </div>
        )}
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

const ContactPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const contact = pageInCulture(currentCulture, data.contact)

  return (
    <Layout
      culture={currentCulture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
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

export default ContactPage;
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
        fr {
          mobile
          tablet
          desktop
          large_desktop
        }
      }
      headerImageAlt {
        en
        nl
        fr
      }
      aboveTitle {
        en
        nl
        fr
      }
      title {
        en
        nl
        fr
      }
      labelAddress {
        en
        nl
        fr
      }
      labelCity {
        en
        nl
        fr
      }
      labelCompany {
        en
        nl
        fr
      }
      labelCountry {
        en
        nl
        fr
      }
      labelMessage {
        en
        nl
        fr
      }
      labelEmail {
        en
        nl
        fr
      }
      labelName {
        en
        nl
        fr
      }
      labelPhone {
        en
        nl
        fr
      }
      labelZip {
        en
        nl
        fr
      }
      aboveAddress {
        en
        nl
        fr
      }
      address {
        en
        nl
        fr
      }
      email {
        en
        nl
        fr
      }
      phone {
        en
        nl
        fr
      }
      errorText {
        nl
        en
        fr
      }
      facebookUrl {
        en
        nl
        fr
      }
      linkedInUrl {
        en
        nl
        fr
      }
      sendButtonText {
        en
        nl
        fr
      }
      successText {
        en
        nl
        fr
      }
      errorText {
        en
        nl
        fr
      }
    }
  }
`
