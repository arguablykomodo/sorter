<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Item from "$lib/Item.svelte";

  const items: ComponentProps<typeof Item>[] = $state([]);
  let newItem: ComponentProps<typeof Item> = $state({
    name: "",
  });
</script>

<h1>Sorter</h1>
<form
  onsubmit={() => {
    items.push(newItem);
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
<ul>
  {#each items as item}
    <li><Item {...item}></Item></li>
  {/each}
</ul>
