import React, { useState } from "react";
import Property from "./Property";
import NewChild from "./NewChild";

function AnimatedProperties() {
  const [propertiesArray, setPropertiesArray] = useState<string[]>([]);
  return (
    <div>
      <h3>Animated Properties</h3>
      {propertiesArray.map((i, index) => {
        return <Property key={index} name={i} />;
      })}
      <NewChild
        type="property"
        children={propertiesArray}
        setChildren={setPropertiesArray}
      />
    </div>
  );
}

export default AnimatedProperties;
