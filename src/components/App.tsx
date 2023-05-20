import { Component, For } from "solid-js";
import { createStore } from "solid-js/store";

import { ItemData } from "../types.ts";
import Importer from "./Importer.tsx";
import ItemCard from "./ItemCard.tsx";

interface State {
  unsorted: ItemData[];
  sorted: ItemData[];
}

const App: Component = () => {
  const [state, setState] = createStore<State>({
    unsorted: [],
    sorted: [],
  });

  function compare(a: ItemData, b: ItemData) {
    return a.name.localeCompare(b.name);
  }

  function sort() {
    const items = [...state.sorted, ...state.unsorted].sort(compare);
    setState({ unsorted: [], sorted: items });
  }

  function onSubmit(item: ItemData) {
    setState("unsorted", (items: ItemData[]) => [...items, item]);
  }

  return (
    <>
      <Importer onSubmit={onSubmit} />
      <h2>Unsorted</h2>
      <For each={state.unsorted}>{(item) => <ItemCard {...item} />}</For>
      <button onClick={sort}>Sort</button>
      <h2>Sorted</h2>
      <For each={state.sorted}>{(item) => <ItemCard {...item} />}</For>
    </>
  );
};

export default App;
