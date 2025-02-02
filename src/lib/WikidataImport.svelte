<script lang="ts">
  import Throbber from "$lib/Throbber.svelte";
  import { type ItemData } from "$lib/Item.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  const presets = new Map([
    [
      "Country Flags",
      `SELECT ?name ?link ?image
WHERE {
  ?item wdt:P31 wd:Q3624078 .
  ?item wdt:P41 ?image .
  ?item rdfs:label ?name filter (lang(?name) = "en")
  ?link schema:about ?item .
  ?link schema:inLanguage "en" .
  ?link schema:isPartOf <https://en.wikipedia.org/> .
}`,
    ],
  ]);

  let query: string | undefined = $state();
  let selectedPreset: string | undefined = $state();
  let promise = $state();
  let loading = $state(false);

  async function fetchData() {
    const searchParams = new URLSearchParams({ query: query ?? "" });
    const url = `/import/wikidata?${searchParams}`;
    const response = await fetch(url);
    const json = await response.json();
    if (response.ok) {
      onImport(json);
    } else throw new Error(json.message);
  }
</script>

<details>
  <summary>Wikidata Import</summary>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      loading = true;
      promise = fetchData().finally(() => (loading = false));
    }}
  >
    <label>
      Presets
      <select
        bind:value={selectedPreset}
        onchange={() => (query = selectedPreset)}
      >
        <option value="" selected></option>
        {#each presets as [name, value]}
          <option {value}>{name}</option>
        {/each}
      </select>
    </label>
    <label>
      SPARQL Query
      <textarea bind:value={query} placeholder="Pick a preset" required>
      </textarea>
    </label>
    <small>
      Query should return properties named
      <code>name</code>,
      <code>link</code> and
      <code>image</code>. Read
      <a href="https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial">
        Wikidata's SPARQL tutorial
      </a>
      for more information.
    </small>
    <input type="submit" value="Import" disabled={loading} />
    {#await promise}
      <small><Throbber />Loading</small>
    {:catch error}
      <small style:color="var(--error-fg)">{error}</small>
    {/await}
  </form>
</details>
