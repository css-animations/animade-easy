import React, { useEffect, useState } from "react";
import PropertyList from "./PropertyList"
import {TimelineNav} from "./TimelineNav"
import {KeyDot} from "./KeyDot"

export function AnimateProperties(){
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
        <div style ={{backgroundColor:"lightblue"}}>
            AnimateProperties
            <button>
                NewKey
            </button>
            <TimelineNav mouseX = {mouseX} mouseY = {mouseY}></TimelineNav>
            <PropertyList></PropertyList>
            <KeyDot x = {mouseX} y = {mouseY} locked = {false} yLock = {100} xmin = {20} xmax = {500} selected = {false}></KeyDot>
        </div>
    )
}