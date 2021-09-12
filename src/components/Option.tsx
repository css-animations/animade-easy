import React, { useState } from "react";

interface OptionProps {
  name: string;
  value: string;
  // possibleValues: string[];
  // setValue: React.Dispatch<React.SetStateAction<string[]>>;
}

function Option(props: OptionProps) {
  const values = ["1", "2", "3"];
  const [value, setValue] = useState(props.value);

  const handleValueChange = (newValue: typeof value) => {
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
