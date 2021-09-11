import React, { useContext } from "react";
import { DevToolContext, DevToolProvider } from "./DevToolContext";
import logo from "./logo.svg";
import AnimatedProperties from "./components/AnimatedProperties";
import "./App.css";

export default function AppWrapper() {
  return (
    <DevToolProvider>
      <AppContent />
    </DevToolProvider>
  );
}
function AppContent() {
  const { resetCSS, attachInspect, detachInspect } = useContext(DevToolContext);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => resetCSS()}>Reset the CSS</button>
        <button onClick={() => attachInspect()}>Inspect a class/div!</button>
        <button onClick={() => detachInspect()}>
          Stop inspecting a class!
        </button>
        <AnimatedProperties />
      </header>
    </div>
  );
}
