<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Item from "$lib/Item.svelte";

  type ItemProps = ComponentProps<typeof Item>;

  const { onImport }: { onImport: (items: ItemProps[]) => void } = $props();

  let newItem: ItemProps = $state({ name: "" });
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    onImport([newItem]);
    newItem = { name: "" };
  }}
>
  <input
    type="text"
    name="name"
    bind:value={newItem.name}
    placeholder="Name"
    required
  />
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
