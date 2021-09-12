import React, { useEffect, useState } from "react";
import PropertyList from "./PropertyList"
import {KeyDot} from "./KeyDot"

export function AnimateProperties(){
    return(
        <div>
            <h2>Animated Properties</h2>
            <PropertyList></PropertyList>
        </div>
    )
}