# CNC Solutions

## Combining Umbraco with Gatsby

- Umbraco instance (on Azure) for content management
- Code in `src/server` exposes the data from Umbraco via http / websockets
- Code in `src/client` captures this in a Gatsby project to create a statically generated website