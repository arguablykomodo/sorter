import { Component, Match, Show, Switch } from "solid-js";

import { ItemData } from "../types.ts";
// @deno-types="../css.d.ts"
import classes from "./ItemCard.module.css";

const ItemCard: Component<ItemData> = (props) => {
  return (
    <article class={classes.item}>
      <h3>
        <Show when={props.link} fallback={props.name}>
          <a href={props.link}>{props.name}</a>
        </Show>
      </h3>
      <Switch>
        <Match when={props.embed}>
          <div class={classes.iframeContainer}>
            <iframe loading="lazy" src={props.embed} />
          </div>
        </Match>
        <Match when={props.image}>
          <img loading="lazy" src={props.image} />
        </Match>
      </Switch>
      <Show when={props.notes}>
        <details>
          <summary>Notes</summary>
          <p>{props.notes}</p>
        </details>
      </Show>
    </article>
  );
};

export default ItemCard;
