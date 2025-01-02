import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { STEAM_WEB_API_KEY } from "$env/static/private";

const baseUrl = "https://api.steampowered.com";

async function steamFetch(endpoint: string, params: Record<string, any>) {
  const query = new URLSearchParams({
    key: STEAM_WEB_API_KEY,
    ...params,
  });
  return fetch(`${baseUrl}/${endpoint}?${query}`).then((r) => r.json());
}

type VanityResponse = {
  response: {
    success: 1;
    steamid: string;
  } | {
    success: 42;
    message: string;
  };
};

type WishlistResponse = {
  response: {
    items: { appid: number }[];
  } | {};
};

type ItemsResponse = {
  response: {
    store_items: ({
      success: 1;
      name: string;
      store_url_path: string;
      assets: {
        asset_url_format: string;
        small_capsule: string;
      };
    } | { success: 42 })[];
  };
};

export const GET: RequestHandler = async (req) => {
  const url = new URL(req.url);

  const wishlistUrl = url.searchParams.get("url");
  if (!wishlistUrl) error(400, "Missing wishlist URL");

  const match = /^https?:\/\/steamcommunity\.com\/wishlist\/id\/(\w+)/
    .exec(wishlistUrl);
  if (!match) error(400, "Wrong URL");

  const vanity: VanityResponse = await steamFetch(
    "ISteamUser/ResolveVanityURL/v1",
    { vanityurl: match[1] },
  );
  if (vanity.response.success !== 1) error(500, vanity.response.message);

  const wishlist: WishlistResponse = await steamFetch(
    "IWishlistService/GetWishlist/v1",
    { steamid: vanity.response.steamid },
  );
  if (!("items" in wishlist.response)) error(500, "Couldn't get wishlist");

  const items: ItemsResponse = await steamFetch(
    "IStoreBrowseService/GetItems/v1",
    {
      input_json: JSON.stringify({
        ids: wishlist.response.items.map((item) => ({ appid: item.appid })),
        context: { country_code: "US" },
        data_request: { include_assets: true },
      }),
    },
  );

  return json(
    items.response.store_items
      .filter((item) => item.success === 1)
      .map((item) => ({
        name: item.name,
        link: "https://store.steampowered.com/" + item.store_url_path,
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/" +
          item.assets.asset_url_format.replace(
            "${FILENAME}",
            item.assets.small_capsule,
          ),
      })),
  );
};
