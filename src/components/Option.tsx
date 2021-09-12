import React, { useState, useContext } from "react";
import { PropertyDataContext, PropertyDataProvider } from "./PropertyDataContext";
import { PropertyReducerActionTypes } from "../utils/propertyDataReducer";
import { AnimationOptions } from "../types/propertyData";

interface OptionProps {
  name: string;
  value: string;
  // possibleValues: string[];
  // setValue: React.Dispatch<React.SetStateAction<string[]>>;
}

function Option(props: OptionProps) {
  const values = ["1", "2", "3"];
  const [value, setValue] = useState(props.value);
  const { propertyData, dispatchPropertyData } = useContext(PropertyDataContext);
  type OptionType = keyof AnimationOptions;

  const handleValueChange = (newValue: typeof value) => {
    setValue(newValue);
    dispatchPropertyData({
      type: PropertyReducerActionTypes.MODIFY_ANIMATION_OPTIONS;
      data: {
        animationOptions: {}
      }
    })
  };

  return (
    <div>
      {props.name}
      <select onChange={(event) => handleValueChange(event.target.value)}>
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
