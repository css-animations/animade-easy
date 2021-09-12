import React, { useState, useContext } from "react";
import NewChild, { NewChildPropTypes } from "./NewChild";
import Option from "./Option";
import { PropertyDataContext, PropertyDataProvider } from "./PropertyDataContext";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

interface PropertyProps {
  // keyframes: Keyframe;
  key: number;
  name: string;
}

function Property(props: PropertyProps) {
  const [animationOptions, setAnimationOptions] = useState<string[]>([]);
  // const [optionValues, setOptionValues] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const { propertyData, dispatchPropertyData } = useContext(PropertyDataContext);

  const handleClick = () => {
    setOpen(!open);
  };

  function animationList() {
    console.log(propertyData);
    return (
      <div>
        {animationOptions.map((optionName, index) => {
          return <Option name={optionName} value="" />;
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
