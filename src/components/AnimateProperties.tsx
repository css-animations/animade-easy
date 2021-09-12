import React, { useEffect, useState } from "react";
import PropertyList from "./PropertyList"
import {TimelineNav} from "./TimelineNav"
import {KeyDot} from "./KeyDot"

export function AnimateProperties(){
  const [scrubberSelected, setScrubberSellected] = useState(false)

    const useMousePosition = () => {
        const [position, setPosition] = useState({ x: 0, y: 0 });
      
        useEffect(() => {
          const setFromEvent = (e: any) => setPosition({ x: e.clientX, y: e.clientY });
          window.addEventListener("mousemove", setFromEvent);
      
          return () => {
            window.removeEventListener("mousemove", setFromEvent);
          };
        }, []);
        
        return position;
      };
    var mouseX = useMousePosition().x;
    var mouseY = useMousePosition().y;
    
    return(
        <div style ={{backgroundColor:"lightblue"}}
          onMouseUp = {() => {setScrubberSellected(false)}}
          onMouseLeave = {() => {if(scrubberSelected){setScrubberSellected(false)}}}>
            AnimateProperties
            <button>
                NewKey
            </button>
            <TimelineNav mouseX = {mouseX} mouseY = {mouseY} scrubberSelected = {scrubberSelected} setScrubberSelected = {setScrubberSellected}></TimelineNav>
            <PropertyList></PropertyList>
            <KeyDot x = {700} y = {700} locked = {false} yLock = {100} xmin = {20} xmax = {500} selected = {false}></KeyDot>
        </div>
    )
}