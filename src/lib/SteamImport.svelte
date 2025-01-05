<script lang="ts">
  import Throbber from "./Throbber.svelte";
  import { type ItemData } from "$lib/Item.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let wishlistUrl: string | undefined = $state();
  let promise = $state();

  async function fetchData() {
    const searchParams = new URLSearchParams({ url: wishlistUrl ?? "" });
    const url = `/import/steam?${searchParams}`;
    const response = await fetch(url);
    const json = await response.json();
    if (response.ok) {
      onImport(json);
    } else throw new Error(json.message);
  }
</script>

<details>
  <summary>Steam Wishlist Import</summary>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      promise = fetchData();
    }}
  >
    <fieldset>
      <label>
        Wishlist URL
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
</details>
