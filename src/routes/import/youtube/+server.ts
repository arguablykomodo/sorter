import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { GOOGLE_API_KEY } from "$env/static/private";

const baseUrl = "https://www.googleapis.com";

async function googleFetch(endpoint: string, params: Record<string, any>) {
  const query = new URLSearchParams({
    key: GOOGLE_API_KEY,
    ...params,
  });
  return fetch(`${baseUrl}/${endpoint}?${query}`).then((r) => r.json());
}

interface PlaylistResponse {
  nextPageToken: string;
  pageInfo: { totalResults: number };
  items: {
    snippet: {
      title: string;
      thumbnails: { high: { url: string } };
      resourceId: { videoId: string };
    };
  }[];
}

export const GET: RequestHandler = async (req) => {
  const url = new URL(req.url);

  const playlistUrl = url.searchParams.get("url");
  if (!playlistUrl) error(400, "Missing URL");

  const match = /^https?:\/\/www\.youtube\.com\/playlist\?list=([\w\d]+)/
    .exec(playlistUrl);
  if (!match) error(400, "Wrong URL");

  let items = [];

  let nextPageToken;
  let totalResults;
  do {
    let result: PlaylistResponse = await googleFetch(
      "youtube/v3/playlistItems",
      {
        part: "snippet",
        playlistId: match[1],
        maxResults: 50,
        pageToken: nextPageToken ?? "",
      },
    );
    nextPageToken = result.nextPageToken;
    totalResults = result.pageInfo.totalResults;
    const newItems = result.items
      .filter((item) => item.snippet.thumbnails.high) // Filter removed videos
      .map((item) => ({
        name: item.snippet.title,
        link: "https://youtu.be/" + item.snippet.resourceId.videoId,
        image: item.snippet.thumbnails.high.url,
      }));
    items.push(...newItems);
  } while (items.length < totalResults);

  return json(items);
};
