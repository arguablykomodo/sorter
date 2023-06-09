import { Component, Match, Show, Switch } from "solid-js";

import { ItemData } from "../types.ts";
// @deno-types="../css.d.ts"
import classes from "./ItemCard.module.css";

interface Props {
  item: ItemData;
  onDelete?: () => void;
}

const ItemCard: Component<Props> = (props) => {
  return (
    <article class={classes.item}>
      <header>
        <h3>
          <Show when={props.item.link} fallback={props.item.name}>
            <a href={props.item.link}>{props.item.name}</a>
          </Show>
        </h3>
        <Show when={props.onDelete}>
          <button onClick={props.onDelete}>{"\u{1F5D1}\uFE0F"}</button>
        </Show>
      </header>
      <Switch>
        <Match when={props.item.embed}>
          <div class={classes.iframeContainer}>
            <iframe loading="lazy" src={props.item.embed} />
          </div>
        </Match>
        <Match when={props.item.image}>
          <img loading="lazy" src={props.item.image} />
        </Match>
      </Switch>
      <Show when={props.item.notes}>
        <details>
          <summary>Notes</summary>
          <p>{props.item.notes}</p>
        </details>
      </Show>
    </article>
  );
};

export default ItemCard;
