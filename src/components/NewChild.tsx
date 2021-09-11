import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";

interface NewChildProps {
  type: string;
  children: string[];
  setChildren: React.Dispatch<React.SetStateAction<string[]>>;
}

const animatableProperties = [
  "border-width",
  "font-size",
  "font-weight",
  "grid-column-gap",
  "grid-gap",
  "grid-row-gap",
  "height",
  "left",
  "letter-spacing",
  "line-height",
  "margin",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "max-height",
  "max-width",
  "min-height",
  "min-width",
  "opacity",
  "padding",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "right",
  "rotate",
  "row-gap",
  "scale",
  "top",
  "width",
  "word-spacing",
  "z-index",
];

function NewChild(props: NewChildProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  let selections: string[] = [];

  switch (props.type) {
    case "property":
      selections = animatableProperties;
      break;
    case "animation option":
      selections = ["ease", "blah"];
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
