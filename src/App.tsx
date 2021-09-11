import React, { useState, useContext } from "react";
import { DevToolContext, DevToolProvider } from "./DevToolContext";
import logo from "./logo.svg";
import AnimatedProperties from "./components/AnimatedProperties";
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
  const {
    injectCSS,
    resetCSS,
    queryElement,
    attachInspect,
    detachInspect,
    highlightElement,
  } = useContext(DevToolContext);

  const [elementInput, setElementInput] = useState("");
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
          value={elementInput}
          placeholder="Choose a Query Selector"
          onChange={(event) => setElementInput(event.target.value)}
        />
        <button onClick={() => resetCSS()}>Reset the CSS</button>
        <button onClick={() => queryElement(elementInput)}>
          Inspect Query Selector!
        </button>
        <button onClick={() => highlightElement(elementInput)}>
          Highlight Query Selector!
        </button>
        <button onClick={() => attachInspect()}>Inspect a class!</button>
        <button onClick={() => detachInspect()}>
          Stop inspecting a class!
        </button>
        <AnimatedProperties />
      </header>
    </div>
  );
}
