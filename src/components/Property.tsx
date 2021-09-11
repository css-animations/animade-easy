import React, { useState } from "react";
import NewChild from "./NewChild";
import Option from "./Option";

interface PropertyProps {
  // keyframes: Keyframe;
  key: number;
  name: string;
}

function Property(props: PropertyProps) {
  const [animationOptions, setAnimationOptions] = useState<string[]>([]);
  return (
    <div>
      {props.name}
      {animationOptions.map((optionName, index) => {
        return <Option name={optionName} value="" />;
      })}
      <NewChild
        type="animation option"
        children={animationOptions}
        setChildren={setAnimationOptions}
      />
    </div>
  );
}

export default Property;
