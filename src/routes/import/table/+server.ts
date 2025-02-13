import { error, json } from "@sveltejs/kit";
import { Parser } from "htmlparser2";
import { DomHandler, Element } from "domhandler";
import { findAll, findOne, textContent } from "domutils";
import type { RequestHandler } from "./$types";

const tagName = (tagName: string) => (e: Element) => e.tagName === tagName;

export const GET: RequestHandler = async (req) => {
  const params = new URL(req.url).searchParams;

  const url = params.get("url");
  if (!url) error(400, "Missing URL");

  if (!params.has("nameCol")) error(400, "Missing name column");
  const nameCol = parseInt(params.get("nameCol")!, 10) - 1;
  const linkCol = parseInt(params.get("linkCol") ?? "0", 10) - 1;
  const imgCol = parseInt(params.get("imageCol") ?? "0", 10) - 1;

  const handler = new DomHandler();
  const parser = new Parser(handler);
  parser.write(await fetch(url).then((r) => r.text()));
  parser.end();

  const items = [];

  const tables = findAll(tagName("table"), handler.dom);
  for (const table of tables) {
    const rows = findAll(tagName("tr"), table);
    for (const row of rows) {
      const cells = findAll(tagName("td"), row);
      if (cells.length === 0) continue;
      items.push({
        name: textContent(cells[nameCol]).trim(),
        link: linkCol >= 0
          ? new URL(findOne(tagName("a"), cells[linkCol])?.attribs?.href!, url)
          : undefined,
        image: imgCol >= 0
          ? new URL(findOne(tagName("img"), cells[imgCol])?.attribs?.src!, url)
          : undefined,
      });
    }
  }

  return json(items);
};
