<script lang="ts">
  import Throbber from "$lib/Throbber.svelte";
  import { type ItemData } from "$lib/Item.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let query: string | undefined = $state();
  let promise = $state();

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
  <summary>Wikidata import</summary>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      promise = fetchData();
    }}
  >
    <fieldset>
      <label>
        SPARQL Query
        <textarea
          bind:value={query}
          placeholder={`# Country Flags
SELECT ?name ?link ?image
WHERE {
  ?item wdt:P31 wd:Q3624078 .
  ?item wdt:P41 ?image .
  ?item rdfs:label ?name filter (lang(?name) = "en")
  ?link schema:about ?item .
  ?link schema:inLanguage "en" .
  ?link schema:isPartOf <https://en.wikipedia.org/> .
}`}
          required
        ></textarea>
      </label>
      <input type="submit" value="Import" />
      {#await promise}
        <small><Throbber />Loading</small>
      {:catch error}
        <small style:color="var(--error-fg)">{error}</small>
      {/await}
    </fieldset>
  </form>
</details>
