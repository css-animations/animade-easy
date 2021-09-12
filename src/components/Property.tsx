import React, { useState, useContext } from "react";
import NewChild, { NewChildPropTypes } from "./NewChild";
import Option from "./Option";
import { PropertyDataContext, PropertyDataProvider } from "./PropertyDataContext";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { ANIMATION_OPTION } from "./NewChild";
import { AnimationDirections, AnimationFillMode, OptionType } from "../types/propertyData";

interface PropertyProps {
  // keyframes: Keyframe;
  key: number;
  name: string;
}

function Property(props: PropertyProps) {
  const [animationOptions, setAnimationOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const { propertyData, dispatchPropertyData } = useContext(PropertyDataContext);

  const handleClick = () => {
    setOpen(!open);
  };

  function stringIsAnimationOption(name: string): name is ANIMATION_OPTION {
    return name in ANIMATION_OPTION;
  }

  function stringIsOptionValue(value: string): value is OptionType {
    return value in AnimationDirections || value in AnimationFillMode;
  }

  const currentProperty = propertyData.propertyMetadata.selectedProperty;

  function animationList() {
    console.log(propertyData);
    const value = "normal";
    return (
      <div>
        {animationOptions.map((optionName, index) => {
          if (
            currentProperty !== undefined &&
            stringIsAnimationOption(optionName) &&
            stringIsOptionValue(value)
          )
            return (
              <Option
                name={optionName}
                value={value} // {propertyData.properties[currentProperty].animationOptions[optionName]}
              />
            );
        })}
        <NewChild
          type={NewChildPropTypes.ANIMATION_OPTION}
          children={animationOptions}
          setChildren={setAnimationOptions}
        />
      </div>
    );
  }

  return (
    <div>
      {props.name}
      <IconButton onClick={handleClick}>
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>

      {open && animationList()}
    </div>
  );
}

export default Property;
