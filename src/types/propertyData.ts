import {} from "react-dom";
import { AbsoluteBezierPoint, Point } from "./bezier";
import { setCurvePointByIndex } from "../utils/bezier";
import {
  PropertyReducerActions,
  PropertyReducerActionTypes,
} from "../utils/propertyDataReducer";
import React from "react";
import { ANIMATABLE_PROPERTIES } from "../components/NewChild";

enum AnimationDirections {}

enum AnimationFillMode {}

enum AnimationIterationCount {}

export interface AnimationOptions {
  animation_direction?: AnimationDirections;
  animation_fill_mode?: AnimationFillMode;
  animation_iteration_count?: AnimationIterationCount;
}

interface TimelineState {}

class PropertyFunctions {
  static bezierWidth: number;
  static bezierHeight: number;

  /// Get the percent (0-1) from a state
  static getKeyframePercent(
    keyframes: AbsoluteBezierPoint[],
    index: number,
  ): Point | undefined {
    if (keyframes.length > index) {
      return {
        x: keyframes[index].pt.x / PropertyFunctions.bezierWidth,
        y: -1 * (keyframes[index].pt.y / PropertyFunctions.bezierHeight) + 1,
      };
    }
    return undefined;
  }

  /// Set the percent (from 0-1) that a keyframe animation should be

  /// Number from 0-1 representing the percentage of progress through the animation.
  /// The function returns the text of a keyframe at that point in time.
  // keyframesAsCss(t: number): string {}
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
