<script lang="ts">
  import {type ItemData} from "$lib/Item.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let newItem: ItemData = $state({ name: "" });
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    onImport([newItem]);
    newItem = { name: "" };
  }}
>
  <fieldset>
    <legend>Manual Input</legend>
    <label>
      Name
      <input type="text" name="name" bind:value={newItem.name} required />
    </label>
    <label>
      Link (optional)
      <input type="url" name="link" bind:value={newItem.link} />
    </label>
    <label>
      Image URL (optional)
      <input type="url" name="image" bind:value={newItem.image} />
    </label>
    <input type="submit" value="Add" />
  </fieldset>
</form>
