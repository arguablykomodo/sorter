<script lang="ts">
  import { type ItemData } from "$lib/Item.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let newItem: ItemData = $state({ name: "" });
</script>

<details>
  <summary>Manual Input</summary>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      onImport([newItem]);
      newItem = { name: "" };
    }}
  >
    <label>
      Name
      <input type="text" bind:value={newItem.name} required />
    </label>
    <label>
      Link (optional)
      <input type="url" bind:value={newItem.link} />
    </label>
    <label>
      Image URL (optional)
      <input type="url" bind:value={newItem.image} />
    </label>
    <input type="submit" value="Add" />
  </form>
</details>
