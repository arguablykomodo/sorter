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
      <h2>Which is greater?</h2>
      <ItemCard item={props.a} />
      <ItemCard item={props.b} />
      <button onClick={[props.onCompare, true]}>A</button>
      <button onClick={[props.onCompare, false]}>B</button>
    </dialog>
  );
};

export default Comparer;
