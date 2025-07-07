<script lang="ts">
  import { type ItemData } from "$lib/Item.svelte";
  import type { Table } from "../routes/import/table/+server.ts";
  import Throbber from "./Throbber.svelte";

  const { onImport }: { onImport: (items: ItemData[]) => void } = $props();

  let url = $state<string>();
  let nameCol = $state<number>();
  let linkCol = $state<number>();
  let imageCol = $state<number>();
  let promise = $state();
  let loading = $state(false);

  interface FilteredTable extends Table {
    selected: boolean;
    nameCol: number;
    linkCol: number;
    imageCol: number;
  }

  let tables = $state<FilteredTable[]>();

  let dialog: HTMLDialogElement;

  async function fetchData() {
    const searchParams = new URLSearchParams();
    if (url) searchParams.set("url", url);
    if (nameCol) searchParams.set("nameCol", nameCol.toString(10));
    if (linkCol) searchParams.set("linkCol", linkCol.toString(10));
    if (imageCol) searchParams.set("imageCol", imageCol.toString(10));
    const response = await fetch(`/import/table?${searchParams}`);
    const json = await response.json();
    if (response.ok) {
      tables = (json as Table[]).map((t) => ({
        selected: false,
        nameCol: -1,
        linkCol: -1,
        imageCol: -1,
        ...t,
      }));
      dialog.showModal();
    } else throw new Error(json.message);
  }
</script>

<details>
  <summary>Table Import</summary>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      loading = true;
      promise = fetchData().finally(() => (loading = false));
    }}
  >
    <label>
      URL
      <input type="url" bind:value={url} required />
    </label>
    <small>Scrapes data from all HTML tables on the given URL.</small>
    <input type="submit" value="Import" />
    {#await promise}
      <small><Throbber />Loading</small>
    {:catch error}
      <small style:color="var(--error-fg)">{error}</small>
    {/await}
  </form>
</details>

<dialog bind:this={dialog}>
  {#if tables}
    {#each tables as t, i}
      <details class="table">
        <summary>
          <input type="checkbox" bind:checked={t.selected} />
          {t.caption ?? `Table ${i + 1}`}
        </summary>
        <table>
          <thead>
            <tr>
              {#each t.headers as header}
                <th>{header}</th>
              {/each}
            </tr>
            <tr>
              {#each { length: Math.max(...t.rows.map((r) => r.length)) } as _, i}
                <th class="columnSelect">
                  <label>
                    <input type="radio" value={i} bind:group={t.nameCol} />
                    Name
                  </label>
                  <br />
                  <label>
                    <input type="radio" value={i} bind:group={t.linkCol} />
                    Link
                  </label>
                  <br />
                  <label>
                    <input type="radio" value={i} bind:group={t.imageCol} />
                    Image
                  </label>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each t.rows as row}
              <tr>
                {#each row as cell}
                  <td>
                    <a href={cell.link}>{cell.name}</a>
                    {#if cell.image}
                      <br /><img src={cell.image} alt={cell.name} />
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </details>
    {/each}
    <button
      class="import"
      onclick={() => {
        dialog.close();
        const items = tables!
          .filter((t) => t.selected)
          .flatMap((t) =>
            t.rows.map((r) => ({
              name: r.at(t.nameCol)?.name ?? "",
              link: r.at(t.linkCol)?.link,
              image: r.at(t.imageCol)?.image,
            })),
          );
        tables = undefined;
        onImport(items);
      }}>Import</button
    >
  {/if}
</dialog>

<style>
  dialog[open] {
    display: flex;
    flex-direction: column;
    gap: 1ch;
    width: calc(100vw - 10ch);
    height: calc(100vh - 10ch);
    overflow: auto;
  }

  table {
    border-collapse: collapse;
  }

  thead {
    background: var(--tertiary-bg);
  }

  td {
    padding: 1ch;
    text-align: center;
  }

  tbody tr:nth-of-type(even) {
    background: var(--secondary-bg);
  }

  .columnSelect {
    border: 1px solid var(--secondary-bg);
    text-align: left;
    padding: 1ch;
    text-wrap: nowrap;
  }

  .import {
    width: 100%;
  }
</style>
