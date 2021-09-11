import React, { useState } from "react";
import { isPropertySignature } from "typescript";

interface OptionProps {
  name: string;
  value: number;
  max?: number;
}

function Option(props: OptionProps) {
  const [value, setValue] = useState(props.value);

  const handleValueChange = (newValue: number) => {
    if (props.max && newValue > props.max) {
      newValue = props.max;
    } else if (newValue < 0) {
      newValue = 0;
    }
    setValue(newValue);
  };

  return (
    <div>
      {props.name}
      <input
        type="number"
        id={props.name}
        name={props.name}
        min={0}
        max={props.max}
        value={value}
        onChange={(event) => handleValueChange(Number(event.target.value))}
      />
    </div>
  );
}

export default Option;
