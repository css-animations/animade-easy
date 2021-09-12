import React, { useEffect, useState } from "react";

interface KeyDotProps{
  x:number,
  y:number,
  locked:boolean,
  yLock:number,
  xmin:number,
  xmax:number,
  selected:boolean,
}
export function KeyDot(props:KeyDotProps){
  var posx = props.x;
  var posy = props.y;

  if (props.x < props.xmin) {
    posx = props.xmin;
  } else if (props.x > props.xmax) {
    posx = props.xmax;
  }

  if (props.locked) {
    posy = props.yLock;
  }
  return (
    <div style = {{
      width:"40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "black",
      left: `${posx - 20}px`,
      top:`${posy - 20}px`,
      position:"absolute",
    }}>

    </div>
  )
}

