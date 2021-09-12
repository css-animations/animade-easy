import React, { useEffect, useState } from "react";

interface Props{
  mouseX: number,
  mouseY: number,
  time: number,
  setTime: React.Dispatch<React.SetStateAction<number>>,
  scrubberSelected: boolean,
  setScrubberSelected: React.Dispatch<React.SetStateAction<boolean>>,
}

export function TimeRuler(props: Props){
    var mousex = props.mouseX;
    const [bounds, setBounds] = useState({x:20,width:20})

    if (props.scrubberSelected) {
      if(posToTime(mousex - bounds.x, bounds.width)  < 0) props.setTime(0);
      else if(posToTime(mousex - bounds.x, bounds.width ) > 1) props.setTime(1);
      else  props.setTime(posToTime(mousex - bounds.x, bounds.width) )
    }


    function labels(totalTime:number){
        let step = totalTime/20;
        let children = []
        for (let i = 0; i <= 20; i++) {
            children.push(<p className="disable-select" style = {{fontSize:"9px", flex:"1"}}>{i*step}</p>)
        }
        return children
    }

    return(
            <div className = "TimeRulerContainer" style = {{width:"400px", height:"40px", backgroundColor:"blue", display:"flex", flexDirection:"row"}}
                onMouseDown ={() => props.setScrubberSelected(true)}
                ref={el => {
                    if (!el) return;
                    // console.log("initial width", el.getBoundingClientRect().width);
                    let prevValue = JSON.stringify(el.getBoundingClientRect());
                    const handle = setInterval(() => {
                      let nextValue = JSON.stringify(el.getBoundingClientRect());
                      if (nextValue === prevValue) {
                        clearInterval(handle);
                        setBounds({x: el.getBoundingClientRect().x, width: el.getBoundingClientRect().width})
                      } else {
                        prevValue = nextValue;
                      }
                    }, 100);
                  }}
                >
                <div className="disable-select" style = {{width:"40px",height:"40px", backgroundColor:"red", position:"absolute", fontSize:"16px", left:`${timeToPos(props.time,bounds.width) + bounds.x -20}px`}}>
                    {100*props.time}%
                </div>
                {labels(100)}
            </div>
    )
}

function timeToPos (time:number, width:number) {
  return (time*width)
}

function posToTime (Pos:number, width:number) {
  return (Pos/width)
}
