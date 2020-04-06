module.exports = {
  siteMetadata: {
    title: `CNC Solutions`,
    description: `CNC Solutions website`,
    author: `@nojaf`,
  },
  plugins: [
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
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-162931414-1",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        respectDNT: true,
      },
    },
    {
      resolve: `gatsby-plugin-facebook-pixel`,
      options: {
        pixelId: "1289120721283216",
      },
    },

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
