<script lang="ts">
  import Item, { type ItemData } from "$lib/Item.svelte";
  import SteamImport from "$lib/SteamImport.svelte";
  import YoutubeImport from "$lib/YoutubeImport.svelte";
  import ManualImport from "$lib/ManualImport.svelte";
  import WikidataImport from "$lib/WikidataImport.svelte";
  import CsvImport from "$lib/CsvImport.svelte";
  import TableImport from "$lib/TableImport.svelte";
  import SortDialog from "$lib/SortDialog.svelte";
  import { stringify } from "csv-stringify/browser/esm/sync";

  let items: ItemData[] = $state([]);
  let sorted = $state(false);
  let sorting = $state(false);

  function importItems(newItems: ItemData[]) {
    items.push(...newItems);
    sorted = false;
  }

  function removeItem(index: number) {
    items.splice(index, 1);
    sorted = false;
  }

  function startSort() {
    sorting = true;
  }

  function onSorted(sortedItems: ItemData[]) {
    sorting = false;
    sorted = true;
    items = sortedItems;
  }

  function csvExport() {
    const ranked = items.map((item, i) => ({ rank: i + 1, ...item }));
    const csv = stringify(ranked, {
      columns: ["rank", "name", "link", "image"],
      header: true,
    });
    const file = new File([csv], "ranked.csv", { type: "text/csv" });
    window.open(URL.createObjectURL(file));
  }
</script>

<main>
  <section class="controls">
    <button class="sortButton" onclick={startSort}>Sort</button>
    <ManualImport onImport={importItems} />
    <SteamImport onImport={importItems} />
    <YoutubeImport onImport={importItems} />
    <CsvImport onImport={importItems} />
    <WikidataImport onImport={importItems} />
    <TableImport onImport={importItems} />
    <button disabled={!sorted} onclick={csvExport}>Export as CSV</button>
  </section>
  <section class="items">
    {#if sorted}
      <ol>
        {#each items as item, i}
          <li>
            <Item {...item}>
              <big>#{i + 1}</big>
            </Item>
          </li>
        {/each}
      </ol>
    {:else}
      <ul>
        {#each items as item, i}
          <li>
            <Item {...item}>
              <button onclick={() => removeItem(i)}>✗</button>
            </Item>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</main>
{#if sorting}
  <SortDialog {items} {onSorted} />
{/if}

<style>
  main {
    display: grid;
    grid-template-columns: 40ch 1fr;
    grid-template-rows: 100vh;
  }

  .controls {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: var(--secondary-bg);
    overflow-y: auto;
  }

  .sortButton {
    font-size: large;
    font-weight: bold;
    background: var(--accent-bg);
    color: white;

    &:hover {
      background: color-mix(in oklab, var(--accent-bg), black 10%);
    }

    &:active {
      background: color-mix(in oklab, var(--accent-bg), black 20%);
    }
  }

  .items {
    overflow-y: auto;
  }

  .items ul,
  .items ol {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .items li {
    list-style: none;
  }

  @media (max-width: 80ch) {
    main {
      grid-template-columns: 100vw;
      grid-template-rows: max-content max-content;
    }
  }
</style>
