import { error, json } from "@sveltejs/kit";
import { fromURL } from "cheerio";
import type { RequestHandler } from "./$types";

export interface Table {
  caption?: string;
  headers: string[];
  rows: Cell[][];
}

export interface Cell {
  name?: string;
  link?: string;
  image?: string;
}

export const GET: RequestHandler = async (req) => {
  const params = new URL(req.url).searchParams;

  const url = params.get("url");
  if (!url) error(400, "Missing URL");

  const $ = await fromURL(url);
  const data = $.extract({
    tables: [{
      selector: "table",
      value: {
        caption: {
          selector: "caption",
          value: (el) => $(el).find("style").remove().end().text().trim(),
        },
        headers: [{
          selector: "th[scope=col]",
          value: (el) => $(el).find("style").remove().end().text().trim(),
        }],
        rows: [{
          selector: "tbody tr",
          value: {
            columns: [{
              selector: "td, th[scope=row]",
              value: (el) => ({
                name: $(el).find("style").remove().end().text().trim(),
                colspan: $(el).prop("colspan"),
                rowspan: $(el).prop("rowspan"),
                link: $(el).find("a").prop("href"),
                image: $(el).find("img").prop("src"),
              }),
            }],
          },
        }],
      },
    }],
  });

  const cleanTables: Table[] = [];
  for (const table of data.tables) {
    if (table.rows.length === 0) continue;
    const cleanRows: Cell[][] = [];
    const spans: number[] = [];
    for (const row of table.rows) {
      if (row.columns.length === 0) continue;
      const cleanColumns: Cell[] = [];
      for (const column of row.columns) {
        while (spans[cleanColumns.length] > 0) {
          spans[cleanColumns.length]--;
          cleanColumns.push(cleanRows.at(-1)![cleanColumns.length]);
        }
        const cell: Cell = {};
        if (column.name) cell.name = column.name;
        if (column.link) cell.link = new URL(column.link, url).toString();
        if (column.image) cell.image = new URL(column.image, url).toString();
        for (let j = 0; j < parseInt(column.colspan ?? "1", 10); j++) {
          if (column.rowspan) {
            spans[cleanColumns.length] = parseInt(column.rowspan, 10) - 1;
          }
          cleanColumns.push(cell);
        }
      }
      while (spans[cleanColumns.length] > 0) {
        spans[cleanColumns.length]--;
        cleanColumns.push(cleanRows.at(-1)![cleanColumns.length]);
      }
      cleanRows.push(cleanColumns);
    }
    cleanTables.push({
      caption: table.caption,
      headers: table.headers,
      rows: cleanRows,
    });
  }

  return json(cleanTables);
};
