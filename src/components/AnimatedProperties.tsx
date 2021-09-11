import React, { useState } from "react";
import Property from "./Property";
import NewChild from "./NewChild";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function AnimatedProperties() {
  const [propertiesArray, setPropertiesArray] = useState<string[]>([]);
  return (
    <div>
      <h3>Animated Properties</h3>
      <div>
        {propertiesArray.map((i, index) => {
          return <Property key={index} name={i} />;
        })}
      </div>
      <NewChild
        type="property"
        children={propertiesArray}
        setChildren={setPropertiesArray}
      />
    </div>
  );
}

export default AnimatedProperties;
