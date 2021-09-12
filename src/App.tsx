import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import {AnimateProperties} from "./components/AnimateProperties";
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
    </div>
  );
}

export default App;
