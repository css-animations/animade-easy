import React, { useEffect, useState } from "react";
import PropertyList from "./PropertyList"
import {KeyDot} from "./KeyDot"

export function AnimateProperties(){
    return(
        <div>
            AnimateProperties
            <button>
                NewKey
            </button>
            <PropertyList></PropertyList>
            <KeyDot x = {700} y = {700} locked = {false} yLock = {100} xmin = {20} xmax = {500} selected = {false}></KeyDot>
        </div>
    )
}