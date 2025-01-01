<script lang="ts">
  import Throbber from "$lib/Throbber.svelte";
  import { type ItemData } from "$lib/Item.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let playlistUrl: string | undefined = $state();
  let promise = $state();

  async function fetchData() {
    const url = `/import/youtube?url=${playlistUrl}`;
    const response = await fetch(url);
    const json = await response.json();
    if (response.ok) {
      onImport(json);
    } else throw new Error(json.message);
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    promise = fetchData();
  }}
>
  <fieldset>
    <legend>Import Youtube Playlist</legend>
    <label>
      Youtube playlist URL
      <input
        type="url"
        name="url"
        bind:value={playlistUrl}
        placeholder="https://www.youtube.com/playlist?list=PLlaN88a7y2_plecYoJxvRFTLHVbIVAOoc"
        required
      />
    </label>
    <input type="submit" value="Import" />
    {#await promise}
      <small><Throbber />Loading</small>
    {:catch error}
      <small style:color="var(--error-fg)">{error}</small>
    {/await}
  </fieldset>
</form>
