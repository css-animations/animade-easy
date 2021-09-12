import React, { useState, useEffect, useReducer, useContext } from "react";
import { AnimateProperties } from "./components/AnimateProperties";
import KeyframeDetails from "./components/KeyframeDetails";
import "./App.css";
import { BezierComponent } from "./components/Canvas";
import ExportWindow from "./components/ExportWindow";
import { Property } from "./types/propertyData";
import {
  propertyReducer,
  PropertyReducerActionTypes,
  propertyReducerDefaultState,
} from "./utils/propertyDataReducer";
import { Point } from "./types/bezier";
import { ANIMATABLE_PROPERTIES } from "./components/NewChild";
import { AnimationPath } from "./components/AnimationPath"
import { PropertyDataContext, PropertyDataProvider } from "./components/PropertyDataContext";

export function AppWrapper() {
  return (
    <PropertyDataProvider>
      <AppContent />
    </PropertyDataProvider>
  );
}

function AppContent() {
  const [headContent, setHeadContent] = useState("");
  const { propertyData, dispatchPropertyData } = useContext(PropertyDataContext);

  //grab initial head content onMount
  useEffect(() => {
    const head = window.document.getElementsByTagName("HEAD")[0];
    setHeadContent(head.innerHTML);
  }, []);

  // Quickly calculates the correct bezier points from the starting points
  useEffect(() => {
    const points: Point[] = [
      { x: 20, y: 400 },
      { x: 100, y: 350 },
      { x: 200, y: 200 },
      { x: 300, y: 80 },
      { x: 400, y: 30 },
    ];

    // dispatchPropertyData({
    //   type: PropertyReducerActionTypes.CREATE_NEW_PROPERTY,
    //   data: {
    //     property: ANIMATABLE_PROPERTIES.width,
    //     animationOptions: {},
    //     points: points,
    //   },
    //   timelineId: ANIMATABLE_PROPERTIES.width,
    // });

    dispatchPropertyData({
      type: PropertyReducerActionTypes.COMPUTE_STARTING_BEZIER_POINTS,
      data: { points: points },
      timelineId: ANIMATABLE_PROPERTIES.width,
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <div className = "buttonWrapper"><button className="AttachAnimation">AttachAnimation</button></div>
        <AnimateProperties/>
        <AnimationPath/>
        <KeyframeDetails/>
        <ExportWindow />
      </header>
    </div>
  );
}
