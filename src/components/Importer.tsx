import { Component, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { ItemData } from "../types.ts";

import classes from "./Importer.module.css";

import ManualInput from "./importers/ManualInput.tsx";
import YtPlaylist from "./importers/YtPlaylist.tsx";
const importers = {
  manual: ManualInput,
  ytPlaylist: YtPlaylist,
};
type ImporterKey = keyof typeof importers;

interface Props {
  onSubmit: (items: ItemData[]) => void;
}

const Importer: Component<Props> = (props) => {
  const [selected, setSelected] = createSignal("manual" as ImporterKey);

  function onTypeChange(e: Event) {
    setSelected((e.target as HTMLSelectElement).value as ImporterKey);
  }

  return (
    <section class={classes.importer}>
      <div class={classes.typeSelector}>
        <label>Type:</label>
        <select onChange={onTypeChange}>
          <option value="manual" selected>Manual Input</option>
          <option value="ytPlaylist">Youtube playlist</option>
        </select>
      </div>
      <Dynamic component={importers[selected()]} onSubmit={props.onSubmit} />
    </section>
  );
};

export default Importer;
