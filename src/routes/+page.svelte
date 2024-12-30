<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Item from "$lib/Item.svelte";
  import { mergeInsertionSort, type Sorter } from "$lib/mergeInsertionSort";

  type ItemProps = ComponentProps<typeof Item>;

  let unsorted: ItemProps[] = $state([]);
  let sorted: ItemProps[] = $state([]);
  let newItem: ItemProps = $state({ name: "" });

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
<form
  onsubmit={(e) => {
    e.preventDefault();
    unsorted.push(newItem);
    newItem = { name: "" };
  }}
>
  <input type="text" name="name" bind:value={newItem.name} placeholder="Name" />
  <input
    type="url"
    name="link"
    bind:value={newItem.link}
    placeholder="Link (optional)"
  />
  <input
    type="url"
    name="image"
    bind:value={newItem.image}
    placeholder="Image URL (optional)"
  />
  <input type="submit" value="Add" />
</form>
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
