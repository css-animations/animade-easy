import React, {useState, useEffect} from "react";
import {TimeRuler} from "./TimeRuler";
import {Labels} from './Labels';

import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from '@material-ui/icons/Pause';
import LoopIcon from '@material-ui/icons/Loop';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

export function AnimationPath(){
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
        setTime(time + .01);
    }

    const handleRewind = () => {
        setTime(time - 1);
    }
    
    return(
        <div className="TimelineNav" 
            onMouseUp = {() => {setScrubberSellected(false)}}
            onMouseLeave = {() => {if(scrubberSelected){setScrubberSellected(false)}}}
            style = {{width:"600px", backgroundColor:"lightblue"}}>TimelineNav
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
            <div>
                <TimeRuler time = {time} setTime = {setTime} mouseX = {mouseX} mouseY = {mouseY} scrubberSelected = {scrubberSelected} setScrubberSelected = {setScrubberSellected}></TimeRuler>
                {/* <BezierComponent
                    currentIndex={1}
                    width={400}
                    height={400}
                    /> */}
                <Labels total={40} numTicks={10} ending={"px"} isRow={true}/>
                <Labels total={40} numTicks={10} ending={"px"} isRow={false}/>
            </div>
        </div>
    )
}