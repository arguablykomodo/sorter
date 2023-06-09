import { Component, createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { ItemData } from "../types.ts";
import { mergeInsertionSort, Sorter } from "../mergeInsertionSort.ts";
import Importer from "./Importer.tsx";
import ItemCard from "./ItemCard.tsx";
import Comparer from "./Comparer.tsx";
// @deno-types="../css.d.ts"
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
    const result = sorter.next();
    if (result.done) {
      setState({ unsorted: [], sorted: result.value });
    } else {
      const [newA, newB] = result.value;
      setA(newA);
      setB(newB);
      setComparing(true);
    }
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

  function onSubmit(newItems: ItemData[]) {
    setState("unsorted", (items: ItemData[]) => [...items, ...newItems]);
  }

  return (
    <>
      <main class={classes.app}>
        <section class={classes.controls}>
          <Importer onSubmit={onSubmit} />
          <button onClick={sort} class={classes.sort}>Sort</button>
        </section>
        <section class={classes.unsorted}>
          <h2>Unsorted</h2>
          <div>
            <For each={state.unsorted}>{(item) => <ItemCard {...item} />}</For>
          </div>
        </section>
        <section class={classes.sorted}>
          <h2>Sorted</h2>
          <div>
            <For each={state.sorted}>{(item) => <ItemCard {...item} />}</For>
          </div>
        </section>
      </main>
      <Show when={comparing()}>
        <Comparer a={a()!} b={b()!} onCompare={onCompare} />
      </Show>
    </>
  );
};

export default App;
