<script lang="ts">
  import { type ItemData } from "$lib/Item.svelte";
  import Throbber from "./Throbber.svelte";
  import { parse } from "csv-parse/browser/esm/sync";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let files: FileList | null | undefined = $state();
  let promise = $state();

  async function parseData() {
    const file = files?.item(0);
    if (!file) throw new Error("Missing file");

    const items: ItemData[] = parse(await file.text(), { columns: true });
    if (items.some((item) => item.name === undefined))
      throw new Error("All items must have a name");

    onImport(items);
  }
</script>

<details>
  <summary>CSV Import</summary>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      promise = parseData();
    }}
  >
    <label>
      File
      <input type="file" name="file" bind:files required />
    </label>
    <small>
      Columns should be named
      <code>name</code>,
      <code>link</code> and
      <code>image</code>.
    </small>
    <input type="submit" value="Import" />
    {#await promise}
      <small><Throbber />Loading</small>
    {:catch error}
      <small style:color="var(--error-fg)">{error}</small>
    {/await}
  </form>
</details>
