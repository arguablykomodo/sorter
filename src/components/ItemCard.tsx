import { Component, createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { ItemData } from "../types.ts";
import EditItem from "./EditItem.tsx";
import classes from "./ItemCard.module.css";

interface Props {
  item: ItemData;
  onDelete?: () => void;
  onEdit?: (item: ItemData) => void;
}

const ItemCard: Component<Props> = (props) => {
  const [editing, setEditing] = createSignal(false);

  function onEdit() {
    setEditing(true);
  }

  function onApply(item: ItemData) {
    props.onEdit!(item);
    setEditing(false);
  }

  function onCancel() {
    setEditing(false);
  }

  return (
    <article class={classes.item}>
      <header>
        <h3>
          <Show when={props.item.link} fallback={props.item.name}>
            <a href={props.item.link}>{props.item.name}</a>
          </Show>
        </h3>
        <Show when={props.onEdit}>
          <button onClick={onEdit}>{"\u{1F4DD}\uFE0F"}</button>
        </Show>
        <Show when={editing()}>
          <Portal>
            <EditItem item={props.item} onApply={onApply} onCancel={onCancel} />
          </Portal>
        </Show>
        <Show when={props.onDelete}>
          <button onClick={props.onDelete}>{"\u{1F5D1}\uFE0F"}</button>
        </Show>
      </header>
      <Show when={props.item.image}>
        <img loading="lazy" src={props.item.image} />
      </Show>
    </article>
  );
};

export default ItemCard;
