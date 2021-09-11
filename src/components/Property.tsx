import React, { useState } from "react";
import Option from "./Option";

interface PropertyProps {
  // keyframes: Keyframe;
  key: number;
  name: string;
}

function Property(props: PropertyProps) {
  const values = ["1", "2", "3"];
  const [value, setValue] = useState("");

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <div>
      {props.name}
      <select onChange={(event) => handleValueChange(event.target.value)}>
        <option hidden> -- select a value -- </option>
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

export default Property;
