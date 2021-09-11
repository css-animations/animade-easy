import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <input
          type="text"
          value={classInput}
          placeholder="Choose a CSS Class"
          onChange={(event) => setClassInput(event.target.value)}
        />
        <button onClick={() => injectCSS(classInput)}>Move the Text</button>
        <button onClick={() => resetCSS()}>Reset the CSS</button>
        <div className="test-class">Boop Dee Boop</div>
      </header>
    </div>
  );
}

export default App;
