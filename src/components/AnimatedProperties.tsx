import React, { useState } from "react";
import Property from "./Property";
import NewChild from "./NewChild";

function AnimatedProperties() {
  const [propertiesArray, setPropertiesArray] = useState<string[]>([]);
  return (
    <div>
      {propertiesArray.map((i, index) => {
        return <Property key={index} name={i} />;
      })}
      <NewChild
        type="jeans"
        children={propertiesArray}
        setChildren={setPropertiesArray}
      />
    </div>
  );
}

export default AnimatedProperties;
