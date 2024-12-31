<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Item from "$lib/Item.svelte";
  import SteamImport from "$lib/SteamImport.svelte";
  import ManualImport from "$lib/ManualImport.svelte";
  import { mergeInsertionSort, type Sorter } from "$lib/mergeInsertionSort";

  type ItemProps = ComponentProps<typeof Item>;

  let items: ItemProps[] = $state([]);
  let comparison: [ItemProps, ItemProps] | undefined = $state(undefined);
  let sorted = $state(false);

  let sorter: Sorter<ItemProps, ItemProps>;

  function startSort() {
    sorter = mergeInsertionSort(items, (item) => item);
    const result = sorter.next();
    if (result.done) {
      items = result.value;
      sorted = true;
    } else comparison = result.value;
  }

  function iterate(greater: boolean) {
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
</script>

<h1>Sorter</h1>
<SteamImport onImport={importItems}></SteamImport>
<ManualImport onImport={importItems}></ManualImport>
<button onclick={startSort}>Sort</button>
{#if sorted}
  <h2>Items</h2>
  <ol>
    {#each items as item}
      <li><Item {...item}></Item></li>
    {/each}
  </ol>
{:else}
  <h2>Results</h2>
  <ul>
    {#each items as item}
      <li><Item {...item}></Item></li>
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
{/if}
