import React, { useState, useContext } from "react";
import NewChild, { NewChildPropTypes } from "./NewChild";
import Option from "./Option";
import { PropertyDataContext, PropertyDataProvider } from "./PropertyDataContext";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { ANIMATION_OPTION, ANIMATABLE_PROPERTIES } from "./NewChild";
import { AnimationDirections, AnimationFillMode, OptionType } from "../types/propertyData";
import { PropertyReducerActionTypes } from "../utils/propertyDataReducer";

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
    if (open && stringIsAnimatableProperty(props.name)) {
      dispatchPropertyData({
        type: PropertyReducerActionTypes.SET_SELECTED_PROPERTY,
        data: {
          property: props.name,
        },
      });
    }
  };

  function stringIsAnimatableProperty(name: string): name is ANIMATABLE_PROPERTIES {
    return name in ANIMATABLE_PROPERTIES;
  }

  function stringIsAnimationOption(name: string): name is ANIMATION_OPTION {
    return name in ANIMATION_OPTION;
  }

  function stringIsOptionValue(value: string): value is OptionType {
    return value in AnimationDirections || value in AnimationFillMode;
  }

  const currentProperty = propertyData.propertyMetadata.selectedProperty;

  function animationList() {
    return (
      <div>
        {animationOptions.map((optionName, index) => {
          // @ts-ignore
          if (
            currentProperty !== undefined &&
            stringIsAnimationOption(optionName) &&
            // @ts-ignore
            (propertyData.properties[currentProperty]?.animationOptions[optionName] === null ||
              stringIsOptionValue(
                // @ts-ignore
                propertyData.properties[currentProperty]?.animationOptions[optionName],
              ))
          )
            return (
              <Option
                name={optionName}
                // @ts-ignore
                value={propertyData.properties[currentProperty].animationOptions[optionName]}
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
