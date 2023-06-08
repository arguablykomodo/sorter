import { Component } from "solid-js";
import { Show } from "solid-js";

import { ItemData } from "../types.ts";
// @deno-types="../css.d.ts"
import classes from "./ItemCard.module.css";

const ItemCard: Component<ItemData> = (props) => {
  return (
    <article class={classes.item}>
      <Show when={props.image}>
        <img src={props.image} />
      </Show>
      <h3>
        <Show when={props.link} fallback={props.name}>
          <a href={props.link}>{props.name}</a>
        </Show>
      </h3>
      <Show when={props.embed}>
        <iframe src={props.embed} />
      </Show>
      <Show when={props.description}>
        <p>{props.description}</p>
      </Show>
      <Show when={props.notes}>
        <p>
          <small>{props.notes}</small>
        </p>
      </Show>
    </article>
  );
};

export default ItemCard;
