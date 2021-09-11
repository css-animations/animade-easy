import React, {useState} from "react";
import Dropdown from "react-dropdown";

interface OptionProps {
    name: string;
    value: string;
}

function Option(props:OptionProps) {
    return (
        <p>{props.name}</p>
    );
}

export default Option;