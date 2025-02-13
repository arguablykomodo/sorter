<script lang="ts">
  import { type ItemData } from "$lib/Item.svelte";
  import Throbber from "./Throbber.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let url = $state<string>();
  let nameCol = $state<number>();
  let linkCol = $state<number>();
  let imageCol = $state<number>();
  let promise = $state();
  let loading = $state(false);

  async function fetchData() {
    const searchParams = new URLSearchParams();
    if (url) searchParams.set("url", url);
    if (nameCol) searchParams.set("nameCol", nameCol.toString(10));
    if (linkCol) searchParams.set("linkCol", linkCol.toString(10));
    if (imageCol) searchParams.set("imageCol", imageCol.toString(10));
    const response = await fetch(`/import/table?${searchParams}`);
    const json = await response.json();
    if (response.ok) {
      onImport(json);
    } else throw new Error(json.message);
  }
</script>

<details>
  <summary>Table Import</summary>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      loading = true;
      promise = fetchData().finally(() => (loading = false));
    }}
  >
    <small>
      Scrapes data from all HTML tables on the given URL.
    </small>
    <label>
      URL
      <input type="url" bind:value={url} required />
    </label>
    <div class="columns">
      <label>
        Name Col.
        <input type="number" min="1" bind:value={nameCol} required />
      </label>
      <label>
        Link Col.
        <input type="number" min="1" bind:value={linkCol} />
      </label>
      <label>
        Image Col.
        <input type="number" min="1" bind:value={imageCol} />
      </label>
    </div>
    <input type="submit" value="Import" />
    {#await promise}
      <small><Throbber />Loading</small>
    {:catch error}
      <small style:color="var(--error-fg)">{error}</small>
    {/await}
  </form>
</details>

<style>
  .columns {
    text-align: center;
    display: flex;
    gap: 1ch;

    label {
      flex: 1 1;
    }

    input {
      width: 100%;
    }
  }
</style>
