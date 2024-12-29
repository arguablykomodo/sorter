import { Component, onCleanup, onMount } from "solid-js";
import { ItemData } from "../types.ts";

import classes from "./EditItem.module.css";

interface Props {
  item: ItemData;
  onApply: (item: ItemData) => void;
  onCancel: () => void;
}

const EditItem: Component<Props> = (props) => {
  let name: HTMLInputElement | undefined;
  let link: HTMLInputElement | undefined;
  let image: HTMLInputElement | undefined;
  let dialog: HTMLDialogElement | undefined;

  onMount(() => dialog!.showModal());
  onCleanup(() => dialog!.close());

  function onApply() {
    props.onApply({
      name: name!.value,
      link: link!.value || undefined,
      image: image!.value || undefined,
    });
  }

  return (
    <dialog class={classes.edit} ref={dialog}>
      <label>Name:</label>
      <input type="text" ref={name} value={props.item.name} />
      <label>Link:</label>
      <input type="text" ref={link} value={props.item.link ?? ""} />
      <label>Image:</label>
      <input type="text" ref={image} value={props.item.image ?? ""} />
      <footer>
        <button onClick={props.onCancel}>Cancel</button>
        <button onClick={onApply}>Apply</button>
      </footer>
    </dialog>
  );
};

export default EditItem;
