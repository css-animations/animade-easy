import {} from "react-dom";
import { AbsoluteBezierPoint, Point } from "./bezier";
import { setCurvePointByIndex } from "../utils/bezier";
import { PropertyReducerActions, PropertyReducerActionTypes } from "../utils/propertyDataReducer";
import React from "react";
import { ANIMATABLE_PROPERTIES } from "../components/NewChild";

export enum AnimationDirections {
  "normal" = "normal",
  "reverse" = "reverse",
  "alternate" = "alternate",
  "alternate_reverse" = "alternate-reverse",
}

export enum AnimationFillMode {
  "none" = "none",
  "forwards" = "forwards",
  "backwards" = "backwards",
  "both" = "both",
}

export type OptionType = keyof AnimationOptions;

export interface AnimationOptions {
  animation_direction?: AnimationDirections;
  animation_fill_mode?: AnimationFillMode;
  animation_iteration_count?: number | "infinite";
}

export function setKeyframePercent(
  keyframes: AbsoluteBezierPoint[],
  percent: Point,
  index: number,
  timelineId: ANIMATABLE_PROPERTIES,
  bezierWidth: number,
  bezierHeight: number,
  dispatchPropertyData: React.Dispatch<PropertyReducerActions>,
) {
  if (keyframes.length > index) {
    const newPoint: Point = {
      x: percent.x * bezierHeight,
      y: percent.y * bezierHeight,
    };
    dispatchPropertyData({
      type: PropertyReducerActionTypes.SET_CURVE_POINT_BY_INDEX,
      data: { heldIndex: { index, field: "pt" }, newPoint: newPoint },
      timelineId,
    });
  }
}

export function getKeyframePercent(
  keyframes: AbsoluteBezierPoint[],
  index: number,
  bezierWidth: number,
  bezierHeight: number,
): Point | undefined {
  if (keyframes.length > index) {
    return {
      x: keyframes[index].pt.x / bezierWidth,
      y: -1 * (keyframes[index].pt.y / bezierHeight) + 1,
    };
  }
  return undefined;
}

export interface Property {
  animationOptions?: AnimationOptions;
  _keyframes: AbsoluteBezierPoint[];
}

export interface PropertyMetadata {
  selectedProperty?: ANIMATABLE_PROPERTIES;
}

type Properties = {
  [key in ANIMATABLE_PROPERTIES]?: Property;
};

export type PropertyData = {
  propertyMetadata: PropertyMetadata;
  properties: Properties;
};
