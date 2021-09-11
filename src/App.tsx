import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  function injectCSS() {
    const head = window.document.getElementsByTagName("HEAD")[0];
    const newStyle = document.createElement("style");
    newStyle.innerHTML = `
    .App-link {
      animation: App-logo-spin infinite 20s linear;
    }
    `;
    head.appendChild(newStyle);
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
        <button onClick={() => injectCSS()}>Move the Text</button>
      </header>
    </div>
  );
}

export default App;
