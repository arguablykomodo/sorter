<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Item from "$lib/Item.svelte";

  const {
    onImport,
  }: {
    onImport: (items: ComponentProps<typeof Item>[]) => void;
  } = $props();

  let steamProfileUrl: string | undefined = $state();
</script>

<form
  onsubmit={async (e) => {
    e.preventDefault();
    const url = `/import/steam?profileUrl=${steamProfileUrl}`;
    const response = await fetch(url);
    const json = await response.json();
    if (response.ok) {
      onImport(json);
    } else if (response.status >= 400 && response.status < 500) {
      console.error(json.message);
      alert(json.message);
    } else {
      console.error(json.message);
      alert(json.message);
    }
  }}
>
  <input
    type="url"
    name="url"
    bind:value={steamProfileUrl}
    placeholder="Steam profile URL"
    pattern="https?://steamcommunity\.com/id/\w+/?"
    required
  />
  <input type="submit" value="Import" />
</form>
