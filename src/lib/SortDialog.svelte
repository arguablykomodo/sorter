<script lang="ts">
  import Item, { type ItemData } from "$lib/Item.svelte";
  import { onDestroy, onMount } from "svelte";
  import { mergeInsertionSort } from "$lib/mergeInsertionSort";

  interface Props {
    items: ItemData[];
    onSorted: (items: ItemData[]) => void;
  }

  const { items, onSorted }: Props = $props();
  const comparisons = Array.from({ length: items.length })
    .map((_, i) => Math.ceil(Math.log2(0.75 * (i + 1))))
    .reduce((a, b) => a + b);

  const sorter = mergeInsertionSort(items, (item) => item);
  let comparison = $state<[ItemData, ItemData]>();
  let iteration = $state(0);
  init();

  let dialog: HTMLDialogElement;
  onMount(() => dialog?.showModal());
  onDestroy(() => dialog?.close());

  function init() {
    const result = sorter.next();
    if (result.done) onSorted(result.value);
    else comparison = result.value;
  }

  function onCompare(greater: boolean) {
    iteration++;
    const result = sorter.next(greater);
    if (result.done) onSorted(result.value);
    else comparison = result.value;
  }
</script>

<dialog bind:this={dialog}>
  <h3>Which is better?</h3>
  <Item {...comparison![0]}>
    <button onclick={() => onCompare(false)}>A</button>
  </Item>
  <Item {...comparison![1]}>
    <button onclick={() => onCompare(true)}>B</button>
  </Item>
  <progress max={comparisons} value={iteration}></progress>
</dialog>

<style>
  dialog[open] {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: none;
    display: grid;
    grid-template-rows: max-content 6em 6em max-content;
    gap: 1ch;
    width: 70ch;
    background: var(--primary-bg);
  }

  ::backdrop {
    background: black;
    opacity: 0.8;
  }
</style>
