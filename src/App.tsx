import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import AnimatedProperties from "./components/AnimatedProperties";
import "./App.css";
import Dropdown from "react-dropdown";
function App() {
  const [headContent, setHeadContent] = useState("");
  const [classInput, setClassInput] = useState("");

  //grab initial head content onMount
  useEffect(() => {
    const head = window.document.getElementsByTagName("HEAD")[0];
    setHeadContent(head.innerHTML);
  }, []);

  function injectCSS(chosenClass: string) {
    const head = window.document.getElementsByTagName("HEAD")[0];
    const newStyle = document.createElement("style");
    newStyle.innerHTML = `
    .${chosenClass} {
      animation: App-logo-spin infinite 20s linear;
    }
    `;
    head.appendChild(newStyle);
  }

  function resetCSS() {
    const head = window.document.getElementsByTagName("HEAD")[0];
    head.innerHTML = headContent;
  }
  return (
    <div className="App">
      <header className="App-header">
        <AnimatedProperties />
      </header>
    </div>
  );
}

export default App;
