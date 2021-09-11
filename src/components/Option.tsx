import React, { useState } from "react";
import Dropdown from "react-dropdown";

interface OptionProps {
  name: string;
  value: string;
}

function Option(props: OptionProps) {
  const values = ["1", "2", "3"];
  const [value, setValue] = useState(props.value);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
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
