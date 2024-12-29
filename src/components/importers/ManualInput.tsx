import { Component } from "solid-js";
import { ItemData } from "../../types.ts";

interface Props {
  onSubmit: (items: ItemData[]) => void;
}

const ManualInput: Component<Props> = (props) => {
  let name: HTMLInputElement | undefined;
  let link: HTMLInputElement | undefined;
  let image: HTMLInputElement | undefined;

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    props.onSubmit([{
      name: name!.value,
      link: link!.value || undefined,
      image: image!.value || undefined,
    }]);
    name!.value = "";
    link!.value = "";
    image!.value = "";
  }

  return (
    <form onSubmit={onSubmit}>
      <label>Name:</label>
      <input type="text" ref={name} />
      <label>Link:</label>
      <input type="text" ref={link} />
      <label>Image:</label>
      <input type="text" ref={image} />
      <input type="submit" value="Add" />
    </form>
  );
};

export default ManualInput;
