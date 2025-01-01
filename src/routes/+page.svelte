<script lang="ts">
  import Item, { type ItemData } from "$lib/Item.svelte";
  import SteamImport from "$lib/SteamImport.svelte";
  import YoutubeImport from "$lib/YoutubeImport.svelte";
  import ManualImport from "$lib/ManualImport.svelte";
  import { mergeInsertionSort, type Sorter } from "$lib/mergeInsertionSort";

  let items: ItemData[] = $state([]);
  let comparison: [ItemData, ItemData] | undefined = $state();
  let iteration = $state(0);
  let comparisons = $state(0);
  let sorted = $state(false);
  let dialog: HTMLDialogElement | undefined = $state();

  let sorter: Sorter<ItemData, ItemData>;

  function startSort() {
    iteration = 0;
    comparisons = 0;
    for (let k = 1; k <= items.length; k++) {
      comparisons += Math.ceil(Math.log2(0.75 * k));
    }
    sorter = mergeInsertionSort(items, (item) => item);
    const result = sorter.next();
    if (result.done) {
      items = result.value;
      sorted = true;
    } else {
      console.log("showmodal");
      dialog?.showModal();
      comparison = result.value;
    }
  }

  function iterate(greater: boolean) {
    iteration++;
    const result = sorter!.next(greater);
    if (result.done) {
      dialog?.close();
      items = result.value;
      comparison = undefined;
      sorted = true;
    } else comparison = result.value;
  }

  function importItems(newItems: ItemData[]) {
    items.push(...newItems);
    sorted = false;
  }

  function removeItem(index: number) {
    items.splice(index, 1);
  }
</script>

<main>
  <section class="controls">
    <button class="sortButton" onclick={startSort}>Sort</button>
    <ManualImport onImport={importItems}></ManualImport>
    <SteamImport onImport={importItems}></SteamImport>
    <YoutubeImport onImport={importItems}></YoutubeImport>
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
<dialog bind:this={dialog}>
  {#if comparison !== undefined}
    <h3>Which is better?</h3>
    <Item {...comparison[0]}>
      <button onclick={() => iterate(false)}>A</button>
    </Item>
    <Item {...comparison[1]}>
      <button onclick={() => iterate(true)}>B</button>
    </Item>
    <progress max={comparisons} value={iteration}></progress>
  {/if}
</dialog>

<style>
  main {
    display: grid;
    grid-template-columns: 30ch 1fr;
    grid-template-rows: 100vh;
  }

  .controls {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
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

  dialog[open] {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: none;
    display: flex;
    flex-direction: column;
    gap: 1ch;
    min-width: 50ch;
    background: --var(--primary-bg);
  }

  ::backdrop {
    background: black;
    opacity: 0.8;
  }
</style>
