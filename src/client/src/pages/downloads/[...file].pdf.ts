import type { APIRoute, GetStaticPaths } from "astro";
import { getTree, collectPdfUrls } from "../../lib/umbraco";

// Backend PDFs (product brochures) are fetched once at build time and served
// from this origin, like the images. Same-origin also makes the `download`
// attribute on the brochure links work; browsers ignore it cross-origin.
export const getStaticPaths: GetStaticPaths = async () => {
  const tree = await getTree();
  return collectPdfUrls(tree.root).map((remote) => ({
    params: {
      file: new URL(remote).pathname.replace(/^\/media\/|\.pdf$/gi, ""),
    },
    props: { remote },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const response = await fetch(props.remote);
  if (!response.ok) {
    throw new Error(`Could not fetch ${props.remote}: ${response.status}`);
  }
  return new Response(await response.arrayBuffer(), {
    headers: { "Content-Type": "application/pdf" },
  });
};
