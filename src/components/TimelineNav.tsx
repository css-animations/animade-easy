import React from "react";
import {TimeRuler} from "./TimeRuler"

interface Props{
    mouseX: number,
    mouseY: number,
}
export function TimelineNav(props: Props){
    return(
        <div className="TimelineNav">TimelineNav
            <div>buttons</div>
            <TimeRuler mouseX = {props.mouseX} mouseY = {props.mouseY}></TimeRuler>
        </div>
    )
}