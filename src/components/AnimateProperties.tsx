import React, { useState } from "react";
import Property from "./Property";
import NewChild, { NewChildPropTypes } from "./NewChild";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

interface RowProps {
  index: number;
  propertyName: string;
}

function Row(props: RowProps) {
  return (
    <TableRow>
      <TableCell
        align="left"
        style={{
          border: 1,
          borderStyle: "solid",
          borderColor: "#599E40",
        }}
      >
        <Property key={props.index} name={props.propertyName} />
      </TableCell>
    </TableRow>
  );
}

export function AnimateProperties() {
  const [propertiesArray, setPropertiesArray] = useState<string[]>([]);
  return (
    <div>
      <h3>Animated Properties</h3>
      <TableContainer>
        <TableBody>
          {propertiesArray.map((propertyName, index) => {
            return <Row index={index} propertyName={propertyName} />;
          })}
        </TableBody>
      </TableContainer>
      <NewChild
        type={NewChildPropTypes.PROPERTY}
        children={propertiesArray}
        setChildren={setPropertiesArray}
      />
    </div>
  );
}

