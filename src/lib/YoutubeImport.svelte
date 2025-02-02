<script lang="ts">
  import Throbber from "$lib/Throbber.svelte";
  import { type ItemData } from "$lib/Item.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let playlistUrl: string | undefined = $state();
  let promise = $state();
  let loading = $state(false);

  async function fetchData() {
    const searchParams = new URLSearchParams({ url: playlistUrl ?? "" });
    const url = `/import/youtube?${searchParams}`;
    const response = await fetch(url);
    const json = await response.json();
    if (response.ok) {
      onImport(json);
    } else throw new Error(json.message);
  }
</script>

<details>
  <summary>Youtube Playlist Import</summary>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      loading = true;
      promise = fetchData().finally(() => (loading = false));
    }}
  >
    <label>
      Playlist URL
      <input
        type="url"
        name="url"
        bind:value={playlistUrl}
        placeholder="https://www.youtube.com/playlist?list=PLlaN88a7y2_plecYoJxvRFTLHVbIVAOoc"
        required
      />
    </label>
    <input type="submit" value="Import" disabled={loading} />
    {#await promise}
      <small><Throbber />Loading</small>
    {:catch error}
      <small style:color="var(--error-fg)">{error}</small>
    {/await}
  </form>
</details>
