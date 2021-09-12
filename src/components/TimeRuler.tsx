import React, { useEffect, useState } from "react";

interface Props{
  mouseX: number,
  mouseY: number,
  time: number,
  setTime: React.Dispatch<React.SetStateAction<number>>,
}

export function TimeRuler(props: Props){
    const [location, setLocation] = useState(0)
    const [clicked, setClicked] = useState(false)
    var mousex = props.mouseX;
    const [bounds, setBounds] = useState({x:20,width:20})
    var leftBound = bounds.x;
    var rightBound = bounds.x + bounds.width;
    
    

    function bounder(clicked:any){
        let loc = 0;
        if(clicked){
            loc = mousex-20;
        } else {
            loc = location;
        }
        if (loc<leftBound) loc = leftBound;
        if (loc>rightBound) loc = rightBound;
        return `${loc}px` 
    }

    function labels(totalTime:number){
        let step = totalTime/20;
        let children = []
        for (let i = 0; i <= 20; i++) {
            children.push(<p style = {{fontSize:"9px", flex:"1"}}>{i*step}</p>)
        }
        return children
    }
    return(
        <div style = {{width:"500px",height:"100px", backgroundColor:"green"}} 
            onMouseUp = {() => {setClicked(false); setLocation(mousex-20)}}
            onMouseLeave = {() => {if(clicked){setClicked(false); setLocation(mousex-20)}}}>
            <div className = "TimeRulerContainer" style = {{width:"400px", height:"40px", backgroundColor:"blue", display:"flex", flexDirection:"row"}}
                onMouseDown ={() => setClicked(true)}
                ref={el => {
                    if (!el) return;
                    console.log("initial width", el.getBoundingClientRect().width);
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
                <div style = {{width:"40px",height:"40px", backgroundColor:"red", position:"absolute", fontSize:"16px", left:bounder(clicked)}}>
                    {bounder(clicked)}
                </div>
                {labels(40)}
            </div>
        </div>
    )
}