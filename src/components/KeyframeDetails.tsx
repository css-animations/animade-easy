import React, { useState } from "react";
import NumOption from "./NumOption";

//Add interface so that keyframe details will reflect the selected keyframe

function KeyframeDetails() {
  //   const [time, setTime] = useState(10);
  //   const [propertyValue, setPropertyValue] = useState(12);
  //   const [tension, setTension] = useState(50);

  return (
    <div>
      <h3>Keyframe Details</h3>
      <NumOption name="Time" value={10} />
      <NumOption name="Property Value" value={12} max={100} />
      <NumOption name="Tesion" value={50} max={100} />
    </div>
  );
}

export default KeyframeDetails;
