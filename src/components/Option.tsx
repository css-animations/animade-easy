import React, { useState, useContext } from "react";
import { PropertyDataContext, PropertyDataProvider } from "./PropertyDataContext";
import { PropertyReducerActionTypes } from "../utils/propertyDataReducer";
import { AnimationDirections, AnimationFillMode, OptionType } from "../types/propertyData";
import { ANIMATION_OPTION } from "./NewChild";

interface OptionProps {
  name: OptionType;
  value: AnimationDirections | AnimationFillMode;
}

function Option(props: OptionProps) {
  const [value, setValue] = useState(props.value);
  const { propertyData, dispatchPropertyData } = useContext(PropertyDataContext);

  let values: AnimationDirections[] | AnimationFillMode[] = [];

  switch (props.name) {
    case "animation_direction":
      values = Object.values(AnimationDirections);
      break;
    case "animation_fill_mode":
      values = Object.values(AnimationFillMode);
      break;
    default:
      values = [];
  }

  const handleValueChange = (newValue: typeof value) => {
    if (propertyData.propertyMetadata.selectedProperty !== undefined) {
      setValue(newValue);
      dispatchPropertyData({
        type: PropertyReducerActionTypes.MODIFY_ANIMATION_OPTIONS,
        data: { [props.name]: newValue },
        timelineId: propertyData.propertyMetadata.selectedProperty,
      });
    }
  };

  function stringIsDirection(value: string): value is AnimationDirections {
    return value in AnimationDirections;
  }

  function stringIsFill(value: string): value is AnimationFillMode {
    return value in AnimationFillMode;
  }

  console.log(propertyData);
  return (
    <div>
      {props.name}
      <select
        onChange={(event) => {
          if (stringIsDirection(event.target.value) || stringIsFill(event.target.value)) {
            handleValueChange(event.target.value);
          }
        }}
        value={value && value}
      >
        <option hidden> -- select an option -- </option>
        {values.map((value, index) => {
          return (
            <option value={value} key={index}>
              {value}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Option;
