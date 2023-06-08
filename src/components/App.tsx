import { Component, createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { ItemData } from "../types.ts";
import { mergeInsertionSort, Sorter } from "../mergeInsertionSort.ts";
import Importer from "./Importer.tsx";
import ItemCard from "./ItemCard.tsx";
import Comparer from "./Comparer.tsx";
import classes from "./App.module.css";

interface State {
  unsorted: ItemData[];
  sorted: ItemData[];
}

const App: Component = () => {
  const [state, setState] = createStore<State>({
    unsorted: [],
    sorted: [],
  });

  let sorter: Sorter;
  const [comparing, setComparing] = createSignal<boolean>(false);
  const [a, setA] = createSignal<ItemData>();
  const [b, setB] = createSignal<ItemData>();
  function sort() {
    sorter = mergeInsertionSort([...state.unsorted, ...state.sorted]) as Sorter;
    const [newA, newB] = sorter.next().value;
    setA(newA);
    setB(newB);
    setComparing(true);
  }

  function onCompare(isGreater: boolean) {
    const result = sorter.next(isGreater);
    if (result.done) {
      setComparing(false);
      setState({ unsorted: [], sorted: result.value });
    } else {
      setA(result.value[0]);
      setB(result.value[1]);
    }
  }

  function onSubmit(item: ItemData) {
    setState("unsorted", (items: ItemData[]) => [...items, item]);
  }

  return (
    <>
      <main class={classes.app}>
        <Importer onSubmit={onSubmit} />
        <section class={classes.unsorted}>
          <h2>Unsorted</h2>
          <For each={state.unsorted}>{(item) => <ItemCard {...item} />}</For>
        </section>
        <section class={classes.sorted}>
          <h2>Sorted</h2>
          <For each={state.sorted}>{(item) => <ItemCard {...item} />}</For>
        </section>
        <button onClick={sort} class={classes.sort}>Sort</button>
      </main>
      <Show when={comparing()}>
        <Comparer a={a()!} b={b()!} onCompare={onCompare} />
      </Show>
    </>
  );
};

export default App;
