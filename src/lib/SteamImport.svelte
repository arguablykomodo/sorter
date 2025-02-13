<script lang="ts">
  import Throbber from "./Throbber.svelte";
  import { type ItemData } from "$lib/Item.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let wishlistUrl: string | undefined = $state();
  let promise = $state();
  let loading = $state(false);

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
      loading = true;
      promise = fetchData().finally(() => (loading = false));
    }}
  >
    <label>
      Wishlist URL
      <input
        type="url"
        bind:value={wishlistUrl}
        placeholder="https://steamcommunity.com/wishlist/id/gabelogannewell"
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
