import React, { useState, useContext } from "react";
import { DevToolContext, DevToolProvider } from "./DevToolContext";
import logo from "./logo.svg";
import "./App.css";
import { devtools } from "webextension-polyfill";

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
export default function AppWrapper() {
  return (
    <DevToolProvider>
      <AppContent />
    </DevToolProvider>
  );
}
function AppContent() {
  const { injectCSS, injectedStyles, resetCSS } = useContext(DevToolContext);
  const [classInput, setClassInput] = useState("");
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
