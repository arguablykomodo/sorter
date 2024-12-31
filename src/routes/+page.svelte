<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Item from "$lib/Item.svelte";
  import SteamImport from "$lib/SteamImport.svelte";
  import ManualImport from "$lib/ManualImport.svelte";
  import { mergeInsertionSort, type Sorter } from "$lib/mergeInsertionSort";

  type ItemProps = ComponentProps<typeof Item>;

  let items: ItemProps[] = $state([]);
  let comparison: [ItemProps, ItemProps] | undefined = $state(undefined);
  let iteration = $state(0);
  let comparisons = $state(0);
  let sorted = $state(false);

  let sorter: Sorter<ItemProps, ItemProps>;

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
    } else comparison = result.value;
  }

  function iterate(greater: boolean) {
    iteration++;
    const result = sorter!.next(greater);
    if (result.done) {
      items = result.value;
      comparison = undefined;
      sorted = true;
    } else comparison = result.value;
  }

  function importItems(newItems: ItemProps[]) {
    items.push(...newItems);
    sorted = false;
  }

  function removeItem(index: number) {
    items.splice(index, 1);
  }
</script>

<h1>Sorter</h1>
<SteamImport onImport={importItems}></SteamImport>
<ManualImport onImport={importItems}></ManualImport>
<button onclick={startSort}>Sort</button>
{#if sorted}
  <h2>Results</h2>
  <ol>
    {#each items as item (item.name)}
      <li><Item {...item}></Item></li>
    {/each}
  </ol>
{:else}
  <h2>Items</h2>
  <ul>
    {#each items as item, i (item.name)}
      <li>
        <Item {...item}></Item><button onclick={() => removeItem(i)}>🗑</button>
      </li>
    {/each}
  </ul>
{/if}
{#if comparison !== undefined}
  <h3>Which is better?</h3>
  <ul>
    <li>
      <button onclick={() => iterate(false)}>A</button>
      <Item {...comparison[0]}></Item>
    </li>
    <li>
      <button onclick={() => iterate(true)}>B</button>
      <Item {...comparison[1]}></Item>
    </li>
  </ul>
  <progress max={comparisons} value={iteration}></progress>
{/if}
