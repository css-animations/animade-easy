import React, {useState} from "react";
import {TimeRuler} from "./TimeRuler";

import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from '@material-ui/icons/Pause';
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
    const [playing, setPlaying] = useState(false);
    const [loop, setLoop] = useState(false);

    const togglePlay = () => {
        setPlaying(!playing);
    }

    const toggleLoop = () => {
        setLoop(!loop);
    }

    const handleSkipForward = () =>{
        setTime(time + 1);
    }

    const handleRewind = () => {
        setTime(time - 1);
    }
    
    return(
        <div className="TimelineNav">TimelineNav
            <div>
                <IconButton onClick={togglePlay}>
                    {playing ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton onClick={toggleLoop}>
                    <LoopIcon />
                </IconButton>
                <IconButton onClick={handleRewind}>
                    <ArrowBackIcon />
                </IconButton>
                <IconButton onClick={handleSkipForward}>
                    <ArrowForwardIcon />
                </IconButton>
            </div>
            <TimeRuler time = {time} setTime = {setTime} mouseX = {props.mouseX} mouseY = {props.mouseY} scrubberSelected = {props.scrubberSelected} setScrubberSelected = {props.setScrubberSelected}></TimeRuler>
        </div>
    )
}