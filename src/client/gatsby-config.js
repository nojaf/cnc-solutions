module.exports = {
  siteMetadata: {
    title: `CNC Solutions`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
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
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
