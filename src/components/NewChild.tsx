import React, { useState, useContext } from "react";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";
import { PropertyDataContext, PropertyDataProvider } from "./PropertyDataContext";
import { PropertyReducerActionTypes } from "../utils/propertyDataReducer";
import { AnimationOptions } from "../types/propertyData";
import { Point } from "../types/bezier";
import { isOptionalTypeNode } from "typescript";

export enum NewChildPropTypes {
  PROPERTY = "property",
  ANIMATION_OPTION = "animation_option",
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
}

export enum ANIMATION_OPTION {
  "animation_direction" = "animation_direction",
  "animation_fill_mode" = "animation_fill_mode",
  "animation_iteration_count" = "animation_iteration_count",
}

function stringIsAnimatableProperty(name: string): name is ANIMATABLE_PROPERTIES {
  return name in ANIMATABLE_PROPERTIES;
}

function stringIsAnimationOption(name: string): name is ANIMATION_OPTION {
  return name in ANIMATION_OPTION;
}

function NewChild(props: NewChildProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<ANIMATABLE_PROPERTIES | ANIMATION_OPTION>();
  const { propertyData, dispatchPropertyData } = useContext(PropertyDataContext);

  let selections: ANIMATABLE_PROPERTIES[] | ANIMATION_OPTION[] = [];

  switch (props.type) {
    case "property":
      selections = Object.values(ANIMATABLE_PROPERTIES);
      break;
    case "animation_option":
      selections = Object.values(ANIMATION_OPTION);
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

  const handleNameChange = (newName: ANIMATABLE_PROPERTIES | ANIMATION_OPTION) => {
    setName(newName);
  };

  const handlePropertySubmit = () => {
    if (name !== undefined && stringIsAnimatableProperty(name)) {
      const points: Point[] = [
        { x: 20, y: 400 },
        { x: 100, y: 350 },
        { x: 200, y: 200 },
        { x: 300, y: 80 },
        { x: 400, y: 30 },
      ];
      dispatchPropertyData({
        type: PropertyReducerActionTypes.CREATE_NEW_PROPERTY,
        data: {
          property: name,
          animationOptions: {},
          points: points,
        },
        timelineId: name,
      });
      props.setChildren([...props.children, name]);
      setOpen(false);
      setName(undefined);
    }
  };

  const handleAnimationSubmit = () => {
    if (
      name !== undefined &&
      propertyData.propertyMetadata.selectedProperty !== undefined &&
      stringIsAnimationOption(name)
    ) {
      dispatchPropertyData({
        type: PropertyReducerActionTypes.MODIFY_ANIMATION_OPTIONS,
        data: { [name]: null },
        timelineId: propertyData.propertyMetadata.selectedProperty,
      });
      props.setChildren([...props.children, name]);
      setOpen(false);
      setName(undefined);
    }
  };

  const body = (
    <div>
      <select
        value={name}
        onChange={(event) => {
          if (
            stringIsAnimatableProperty(event.target.value) ||
            stringIsAnimationOption(event.target.value)
          ) {
            handleNameChange(event.target.value);
          }
        }}
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
      <button onClick={props.type === "property" ? handlePropertySubmit : handleAnimationSubmit}>
        Submit
      </button>
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
