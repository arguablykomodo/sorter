import { Component } from "solid-js";
import { ItemData } from "../types.ts";

// @deno-types="../css.d.ts"
import classes from "./Importer.module.css";

interface Props {
  onSubmit: (item: ItemData) => void;
}

const Adder: Component<Props> = (props) => {
  let name: HTMLInputElement | undefined;
  let description: HTMLTextAreaElement | undefined;
  let link: HTMLInputElement | undefined;
  let image: HTMLInputElement | undefined;
  let embed: HTMLInputElement | undefined;
  let notes: HTMLTextAreaElement | undefined;

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    props.onSubmit({
      name: name!.value,
      description: description!.value || undefined,
      link: link!.value || undefined,
      image: image!.value || undefined,
      embed: embed!.value || undefined,
      notes: notes!.value || undefined,
    });
    name!.value = "";
    description!.value = "";
    link!.value = "";
    image!.value = "";
    embed!.value = "";
    notes!.value = "";
  }

  return (
    <form class={classes.importer} onSubmit={onSubmit}>
      <label>Name:</label>
      <input type="text" ref={name} />
      <label>Description:</label>
      <textarea ref={description} />
      <label>Link:</label>
      <input type="text" ref={link} />
      <label>Image:</label>
      <input type="text" ref={image} />
      <label>Embed:</label>
      <input type="text" ref={embed} />
      <label>Notes:</label>
      <textarea ref={notes} />
      <input type="submit" value="Add" class={classes.submit} />
    </form>
  );
};

export default Adder;
