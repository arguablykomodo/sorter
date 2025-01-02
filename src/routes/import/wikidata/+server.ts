import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

type WikidataResponse = {
  head: { vars: string[] };
  results: {
    bindings: {
      image?: { value: string };
      link?: { value: string };
      name?: { value: string };
    }[];
  };
};

export const GET: RequestHandler = async (req) => {
  const url = new URL(req.url);

  const query = url.searchParams.get("query");
  if (!query) error(400, "Missing query");

  const requestUrl = new URL("https://query.wikidata.org/sparql");
  requestUrl.searchParams.set("query", query);
  requestUrl.searchParams.set("format", "json");
  const response: WikidataResponse = await fetch(requestUrl)
    .then((r) => r.json());

  return json(response.results.bindings.map((x) => ({
    name: (x.name ?? error(500, "Query returns no names")).value,
    link: x.link?.value,
    image: x.image?.value,
  })));
};
