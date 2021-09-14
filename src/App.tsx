import React, { useState, useEffect, useReducer, useContext } from "react";
import { DevToolContext, DevToolProvider } from "./DevToolContext";
import { AnimateProperties } from "./components/AnimateProperties";
import KeyframeDetails from "./components/KeyframeDetails";
import "./App.css";
import ExportWindow from "./components/ExportWindow";
import { PropertyReducerActionTypes } from "./utils/propertyDataReducer";
import { Point } from "./types/bezier";
import { ANIMATABLE_PROPERTIES } from "./components/NewChild";
import { AnimationPath } from "./components/AnimationPath";
import { PropertyDataContext, PropertyDataProvider } from "./components/PropertyDataContext";

export function AppWrapper() {
  return (
    <DevToolProvider>
      <PropertyDataProvider>
        <AppContent />
      </PropertyDataProvider>
    </DevToolProvider>
  );
}

function AppContent() {
  const [headContent, setHeadContent] = useState("");
  const { propertyData, dispatchPropertyData } = useContext(PropertyDataContext);
  const { attachInspect, setChosenClasses, chosenClasses } = useContext(DevToolContext);

  //grab initial head content onMount
  useEffect(() => {
    const head = window.document.getElementsByTagName("HEAD")[0];
    setHeadContent(head.innerHTML);
  }, []);

  // Quickly calculates the correct bezier points from the starting points
  useEffect(() => {
    const points: Point[] = [
      { x: 0, y: 300 },
      { x: 100, y: 250 },
      { x: 200, y: 150 },
      { x: 300, y: 50 },
      { x: 400, y: 0 },
    ];

    dispatchPropertyData({
      type: PropertyReducerActionTypes.CREATE_NEW_PROPERTY,
      data: {
        property: ANIMATABLE_PROPERTIES.rotate,
        animationOptions: {},
        points: points,
      },
      timelineId: ANIMATABLE_PROPERTIES.rotate,
    });

    dispatchPropertyData({
      type: PropertyReducerActionTypes.COMPUTE_STARTING_BEZIER_POINTS,
      data: { points: points },
      timelineId: ANIMATABLE_PROPERTIES.rotate,
    });
  }, []);

  const chosenClassContainers = Object.keys(chosenClasses).map((sect) => (
    <span
      style={{
        margin: "5px",
        fontSize: "20px",
        cursor: "pointer",
      }}
      onClick={() => {
        setChosenClasses((prevClasses) => {
          const newClasses: any = { ...prevClasses };
          delete newClasses[sect];
          return newClasses;
        });
      }}
    >
      {sect}
    </span>
  ));
  return (
    <div className="App">
      <header className="App-header">
        <div className="buttonWrapper">
          <button className="AttachAnimation" onClick={() => attachInspect()}>
            Attach Animation
          </button>
        </div>
        <AnimateProperties />
        <AnimationPath />
        {/*<KeyframeDetails />*/}
        <h3>Chosen Classes: (click to remove)</h3>
        <div>{chosenClassContainers}</div>
        <ExportWindow />
      </header>
    </div>
  );
}
