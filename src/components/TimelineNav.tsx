import React, {useState} from "react";
import {TimeRuler} from "./TimeRuler";

import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import LoopIcon from '@material-ui/icons/Loop';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

interface Props{
    mouseX: number,
    mouseY: number,
    scrubberSelected: boolean,
    setScrubberSelected: React.Dispatch<React.SetStateAction<boolean>>,
}
export function TimelineNav(props: Props){
    const [time, setTime] = useState(0);
    
    return(
        <div className="TimelineNav">TimelineNav
            <div>
                <IconButton>
                    <PlayArrowIcon />
                </IconButton>
                <IconButton>
                    <LoopIcon />
                </IconButton>
                <IconButton>
                    <ArrowBackIcon />
                </IconButton>
                <IconButton>
                    <ArrowForwardIcon />
                </IconButton>
            </div>
            <TimeRuler time = {time} setTime = {setTime} mouseX = {props.mouseX} mouseY = {props.mouseY} scrubberSelected = {props.scrubberSelected} setScrubberSelected = {props.setScrubberSelected}></TimeRuler>
        </div>
    )
}