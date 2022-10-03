module.exports = {
  siteMetadata: {
    title: `CNC Solutions`,
    description: `CNC Solutions website`,
    author: `@nojaf`,
  },
  plugins: [
    { // this must be loaded first in order to work
      resolve: `gatsby-plugin-google-gtag`, // note this instead of gatsby-plugin-react-helmet
      options: {
        trackingIds: [ "GTM-PX6K6L4"],
        pluginConfig: {
          head: true,
          anonymize: false
        }
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `cnc-solutions`,
        short_name: `cncsolutions`,
        start_url: `/`,
        background_color: `#92C256`,
        theme_color: `#92C256`,
        display: `minimal-ui`,
        icon: `src/images/CNC-Logo.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-facebook-pixel`,
      options: {
        pixelId: "570426677009391",
      },
    },

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
