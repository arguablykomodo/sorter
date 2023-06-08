import { Component, onCleanup, onMount } from "solid-js";

import { ItemData } from "../types.ts";
import ItemCard from "./ItemCard.tsx";
// @deno-types="../css.d.ts"
import classes from "./Comparer.module.css";

interface Props {
  a: ItemData;
  b: ItemData;
  onCompare: (isGreater: boolean) => void;
}

const Comparer: Component<Props> = (props) => {
  let dialog: HTMLDialogElement | undefined;

  onMount(() => dialog!.showModal());
  onCleanup(() => dialog!.close());

  return (
    <dialog ref={dialog} class={classes.comparer}>
      <main>
        <ItemCard {...props.a} />
        <span>{">"}</span>
        <ItemCard {...props.b} />
      </main>
      <footer>
        <button onClick={[props.onCompare, true]}>Yes</button>
        <button onClick={[props.onCompare, false]}>No</button>
      </footer>
    </dialog>
  );
};

export default Comparer;
