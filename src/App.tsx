import { DevToolContext, DevToolProvider } from "./DevToolContext";
import logo from "./logo.svg";
import "./App.css";
import React, { useState, useContext, useEffect, useReducer } from "react";
import { AnimateProperties } from "./components/AnimateProperties";
import KeyframeDetails from "./components/KeyframeDetails";
import "./App.css";
import { BezierComponent } from "./components/Canvas";
import { Property } from "./types/propertyData";
import {
  propertyReducer,
  PropertyReducerActionTypes,
  propertyReducerDefaultState,
} from "./utils/propertyDataReducer";
import { Point } from "./types/bezier";
import { ANIMATABLE_PROPERTIES } from "./components/NewChild";
import { animationPropertyType } from "./DevToolContext";

const TEST_DATA = [0, 0.13, 0.8, 1];

const TEST_STUFF: animationPropertyType[] = [
  {
    animationName: "fun",
    duration: "4s",
    value: "yo",
    direction: "up",
  },
];

export default function AppWrapper() {
  return (
    <DevToolProvider>
      <AppContent />
    </DevToolProvider>
  );
}
function AppContent() {
  const {
    resetCSS,
    attachInspect,
    detachInspect,
    from,
    setFrom,
    to,
    setTo,
    chosenClasses,
    chosenIDs,
    setChosenClasses,
    injectCSSAnimation,
    injectCSSAnimationClasses,
    injectedAnimations,
  } = useContext(DevToolContext);
  const [propertyData, dispatchPropertyData] = useReducer(
    propertyReducer,
    propertyReducerDefaultState,
  );
  const [classInput, setClassInput] = useState("");

  const chosenClassContainers = Object.keys(chosenClasses).map((sect) => (
    <span
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

  const chosenClassNames = Object.keys(chosenClasses).map((sect) => "." + sect);

  // Quickly calculates the correct bezier points from the starting points
  useEffect(() => {
    const points: Point[] = [
      { x: 20, y: 400 },
      { x: 100, y: 350 },
      { x: 200, y: 200 },
      { x: 300, y: 80 },
      { x: 400, y: 30 },
    ];

    dispatchPropertyData({
      type: PropertyReducerActionTypes.CREATE_NEW_PROPERTY,
      data: {
        property: ANIMATABLE_PROPERTIES.width,
        points: points,
      },
      timelineId: ANIMATABLE_PROPERTIES.width,
    });

    dispatchPropertyData({
      type: PropertyReducerActionTypes.COMPUTE_STARTING_BEZIER_POINTS,
      data: { points: points },
      timelineId: ANIMATABLE_PROPERTIES.scale,
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <KeyframeDetails />
        {propertyData.propertyMetadata.selectedProperty &&
        propertyData.propertyMetadata.selectedProperty in
          propertyData.properties ? (
          <BezierComponent
            propertyData={
              propertyData.properties[
                propertyData.propertyMetadata.selectedProperty
              ] as Property
            }
            currentIndex={1}
            width={400}
            height={400}
            timelineId={propertyData.propertyMetadata.selectedProperty}
            dispatchPropertyData={dispatchPropertyData}
          />
        ) : (
          <div>Select or create a property to view it's curve!</div>
        )}
        <input
          type="number"
          value={from}
          placeholder="From"
          onChange={(event) => setFrom(Number(event.target.value))}
        />
        <input
          type="number"
          value={to}
          placeholder="To"
          onChange={(event) => setTo(Number(event.target.value))}
        />

        <button onClick={() => resetCSS()}>Reset the CSS</button>
        <button onClick={() => attachInspect()}>Inspect a class/div!</button>
        <button onClick={() => detachInspect()}>
          Stop inspecting a class!
        </button>
        <div>Chosen IDs: {Object.keys(chosenIDs)}</div>
        <div>Chosen Classes: {chosenClassContainers}</div>
        <button
          onClick={() =>
            injectCSSAnimationClasses(TEST_STUFF, chosenClassNames)
          }
        >
          Apply Animation!
        </button>
        <input
          type="text"
          placeholder="Animation Name"
          value={classInput}
          onChange={(event) => setClassInput(event.target.value)}
        />
        <button onClick={() => injectCSSAnimation(classInput, TEST_DATA)}>
          Inject Animation!
        </button>
        <div>Generated Animations: {injectedAnimations}</div>
      </header>
    </div>
  );
}
