<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Item from "$lib/Item.svelte";

  const {
    onImport,
  }: {
    onImport: (items: ComponentProps<typeof Item>[]) => void;
  } = $props();

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
  <input
    type="url"
    name="url"
    bind:value={playlistUrl}
    placeholder="Youtube playlist URL"
    required
  />
  <input type="submit" value="Import" />
  {#await promise}
    <span>Loading...</span>
  {:catch error}
    <span>{error}</span>
  {/await}
</form>
