<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Item from "$lib/Item.svelte";
  import SteamImport from "$lib/SteamImport.svelte";
  import ManualImport from "$lib/ManualImport.svelte";
  import { mergeInsertionSort, type Sorter } from "$lib/mergeInsertionSort";

  type ItemProps = ComponentProps<typeof Item>;

  let unsorted: ItemProps[] = $state([]);
  let sorted: ItemProps[] = $state([]);

  let sorter: Sorter<ItemProps, ItemProps>;
  let comparison: [ItemProps, ItemProps] | undefined = $state(undefined);

  function startSort() {
    sorter = mergeInsertionSort(unsorted, (item) => item);
    const result = sorter.next();
    if (result.done) {
      unsorted = [];
      sorted = result.value;
    } else comparison = result.value;
  }

  function iterate(greater: boolean) {
    const result = sorter!.next(greater);
    if (result.done) {
      unsorted = [];
      sorted = result.value;
      comparison = undefined;
    } else comparison = result.value;
  }
</script>

<h1>Sorter</h1>
<SteamImport onImport={(items) => unsorted.push(...items)}></SteamImport>
<ManualImport onImport={(items) => unsorted.push(...items)}></ManualImport>
<button onclick={startSort}>Sort</button>
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
<h2>Unsorted</h2>
<ul>
  {#each unsorted as item}
    <li><Item {...item}></Item></li>
  {/each}
</ul>
<h2>Sorted</h2>
<ol>
  {#each sorted as item}
    <li><Item {...item}></Item></li>
  {/each}
</ol>
