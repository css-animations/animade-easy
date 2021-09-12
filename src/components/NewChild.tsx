import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";

export enum NewChildPropTypes {
  PROPERTY = "property",
  ANIMATION_OPTION = "animation_option"
}

interface NewChildProps {
  type: NewChildPropTypes;
  children: string[];
  setChildren: React.Dispatch<React.SetStateAction<string[]>>;
}

export enum ANIMATABLE_PROPERTIES {
  "border-width" = "border-width",
  "font-size" = "font-size",
  "font-weight" = "font-weight",
  "grid-column-gap" = "grid-column-gap",
  "grid-gap" = "grid-gap",
  "grid-row-gap" = "grid-row-gap",
  "height" = "height",
  "left" = "left",
  "letter-spacing" = "letter-spacing",
  "line-height" = "line-height",
  "margin" = "margin",
  "margin-bottom" = "margin-bottom",
  "margin-left" = "margin-left",
  "margin-right" = "margin-right",
  "margin-top" = "margin-top",
  "max-height" = "max-height",
  "max-width" = "max-width",
  "min-height" = "min-height",
  "min-width" = "min-width",
  "opacity" = "opacity",
  "padding" = "padding",
  "padding-bottom" = "padding-bottom",
  "padding-left" = "padding-left",
  "padding-right" = "padding-right",
  "padding-top" = "padding-top",
  "right" = "right",
  "rotate" = "rotate",
  "row-gap" = "row-gap",
  "scale" = "scale",
  "top" = "top",
  "width" = "width",
  "word-spacing" = "word-spacing",
  "z-index" = "z-index",
};

function NewChild(props: NewChildProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  let selections: ANIMATABLE_PROPERTIES[] = [];

  switch (props.type) {
    case "property":
      selections = Object.values(ANIMATABLE_PROPERTIES);
      break;
    case "animation_option":
      selections = [ANIMATABLE_PROPERTIES.height, ANIMATABLE_PROPERTIES.width];
      break;
    default:
      selections = [];
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  const handleSubmit = () => {
    console.log(name);
    if (name !== "") {
      props.setChildren([...props.children, name]);
      setOpen(false);
      setName("");
    }
  };

  const body = (
    <div>
      <select
        value={name}
        onChange={(event) => handleNameChange(event.target.value)}
      >
        <option hidden> -- select an option -- </option>
        {selections.map((selection, index) => {
          return (
            <option value={selection} key={index}>
              {selection}
            </option>
          );
        })}
      </select>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );

  return (
    <div>
      <IconButton aria-label="Add new property" onClick={handleClick}>
        <AddIcon />
      </IconButton>
      Add new {props.type}
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </div>
  );
}

export default NewChild;
