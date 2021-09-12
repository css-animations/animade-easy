import React, { useState, useEffect, useContext } from "react";
// import { DevToolContext, DevToolProvider } from "./DevToolContext";
import logo from "./logo.svg";
import {AnimateProperties} from "./components/AnimateProperties";
import KeyframeDetails from "./components/KeyframeDetails";
import "./App.css";
import {TimelineNav} from "./components/TimelineNav";

function App() {
  const [headContent, setHeadContent] = useState("");
  const [classInput, setClassInput] = useState("");

  //grab initial head content onMount
  useEffect(() => {
    const head = window.document.getElementsByTagName("HEAD")[0];
    setHeadContent(head.innerHTML);
  }, []);

  return (
    <div className="App">
        <AnimateProperties />
        <KeyframeDetails />
    </div>
  );
}

export default App;