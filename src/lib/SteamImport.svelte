<script lang="ts">
  import Throbber from "./Throbber.svelte";
  import { type ItemData } from "$lib/Item.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let wishlistUrl: string | undefined = $state();
  let promise = $state();

  async function fetchData() {
    const url = `/import/steam?url=${wishlistUrl}`;
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
    <legend>Import Steam Wishlist</legend>
    <label>
      Steam wishlist URL
      <input
        type="url"
        name="url"
        bind:value={wishlistUrl}
        placeholder="https://steamcommunity.com/wishlist/id/gabelogannewell"
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
