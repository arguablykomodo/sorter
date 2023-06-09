import { Component, createResource, createSignal } from "solid-js";
import { Match, Show, Switch } from "solid-js/web";
import { ItemData } from "../../types.ts";

interface Props {
  onSubmit: (items: ItemData[]) => void;
}

const feedPrefix = "https://www.youtube.com/feeds/videos.xml?playlist_id=";
const embedPrefix = "https://www.youtube.com/embed/";

function tag(element: Element, name: string): Element {
  return element.getElementsByTagName(name)[0];
}

const YtPlaylist: Component<Props> = (props) => {
  const [url, setUrl] = createSignal<string>();
  const [items] = createResource(url, fetchData);

  async function fetchData(url: string): Promise<ItemData[]> {
    const parsed = new URL(url);
    if (
      !parsed.hostname.endsWith("youtube.com") ||
      !parsed.searchParams.has("list")
    ) throw new Error("Invalid URL");
    const response = await fetch(feedPrefix + parsed.searchParams.get("list"))
      .then((r) => r.text())
      .then((t) => new DOMParser().parseFromString(t, "text/xml"));
    return [...response.querySelectorAll("entry")].map((e) => ({
      name: tag(e, "title").textContent!,
      link: tag(e, "link").getAttribute("href")!,
      image: tag(e, "media:thumbnail").getAttribute("url")!,
      embed: embedPrefix + tag(e, "yt:videoId").textContent!,
    }));
  }

  function onUrlChange(e: Event) {
    setUrl((e.target as HTMLInputElement).value);
  }

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (items.state === "ready") props.onSubmit(items());
  }

  return (
    <form onSubmit={onSubmit}>
      <label>URL:</label>
      <input type="url" placeholder="Playlist url" onChange={onUrlChange} />
      <Switch>
        <Match when={items.loading}>
          <output>Fetching...</output>
        </Match>
        <Match when={items.error}>
          <output style={{ "color": "#f55" }}>{items.error.toString()}</output>
        </Match>
        <Match when={items()}>
          <output>{items()?.length} Videos</output>
        </Match>
      </Switch>
      <input
        type="submit"
        value="Import"
        disabled={items.loading || items() === undefined}
      />
    </form>
  );
};

export default YtPlaylist;
