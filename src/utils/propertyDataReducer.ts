import { computeStartingBezierPoints, DropNewPoint, setCurvePointByIndex } from "./bezier";
import {
  AnimationDirections,
  AnimationFillMode,
  AnimationOptions,
  PropertyData,
} from "../types/propertyData";
import { heldItemData, Point } from "../types/bezier";
import { ANIMATABLE_PROPERTIES } from "../components/NewChild";

export enum PropertyReducerActionTypes {
  SET_CURVE_POINT_BY_INDEX = "SET_CURVE_POINT_BY_INDEX",
  SET_CURVE_POINT_BY_INDEX_PERCENT = "SET_CURVE_POINT_BY_INDEX_PERCENT",
  COMPUTE_STARTING_BEZIER_POINTS = "COMPUTE_STARTING_BEZIER_POINTS",
  CREATE_NEW_PROPERTY = "CREATE_NEW_PROPERTY",
  SET_SELECTED_PROPERTY = "SET_SELECTED_PROPERTY",
  SET_ANIMATION_OPTIONS = "SET_ANIMATION_OPTIONS",
  CREATE_NEW_KEYFRAME = "CREATE_NEW_KEYFRAME",
  MODIFY_ANIMATION_OPTIONS = "MODIFY_ANIMATION_OPTIONS",
}

interface GeneralPropertyReducerActions {
  timelineId: ANIMATABLE_PROPERTIES;
}

interface SET_CURVE_POINT_BY_INDEX_PERCENT extends GeneralPropertyReducerActions {
  type: PropertyReducerActionTypes.SET_CURVE_POINT_BY_INDEX_PERCENT;
  data: {
    percentage: Point;
    index: number;
    bezierWidth: number;
    bezierHeight: number;
  };
}

interface SET_CURVE_BY_INDEX_ACTION extends GeneralPropertyReducerActions {
  type: PropertyReducerActionTypes.SET_CURVE_POINT_BY_INDEX;
  data: {
    heldIndex: heldItemData;
    newPoint: Point;
  };
}

interface COMPUTE_STARTING_BEZIER_POINTS extends GeneralPropertyReducerActions {
  type: PropertyReducerActionTypes.COMPUTE_STARTING_BEZIER_POINTS;
  data: {
    points: Point[];
  };
}

interface CREATE_NEW_PROPERTY extends GeneralPropertyReducerActions {
  type: PropertyReducerActionTypes.CREATE_NEW_PROPERTY;
  data: {
    property: ANIMATABLE_PROPERTIES;
    animationOptions?: AnimationOptions;
    points: Point[];
  };
}

interface SET_SELECTED_PROPERTY {
  type: PropertyReducerActionTypes.SET_SELECTED_PROPERTY;
  data: {
    property: ANIMATABLE_PROPERTIES | undefined;
  };
}

interface CREATE_NEW_KEYFRAME extends GeneralPropertyReducerActions {
  type: PropertyReducerActionTypes.CREATE_NEW_KEYFRAME;
  data:
    | {
        horizontalPixels: number;
      }
    | {
        horizontalPercentage: number;
        bezierWidth: number;
      };
}

interface MODIFY_ANIMATION_OPTIONS extends GeneralPropertyReducerActions {
  type: PropertyReducerActionTypes.MODIFY_ANIMATION_OPTIONS;
  data: AnimationOptions;
}

export type PropertyReducerActions =
  | SET_CURVE_BY_INDEX_ACTION
  | SET_CURVE_POINT_BY_INDEX_PERCENT
  | COMPUTE_STARTING_BEZIER_POINTS
  | CREATE_NEW_PROPERTY
  | SET_SELECTED_PROPERTY
  | CREATE_NEW_KEYFRAME
  | MODIFY_ANIMATION_OPTIONS;

export function propertyReducer(state: PropertyData, action: PropertyReducerActions): PropertyData {
  switch (action.type) {
    case PropertyReducerActionTypes.SET_CURVE_POINT_BY_INDEX:
      if (action.timelineId in state.properties)
        return {
          ...state,
          properties: {
            ...state.properties,
            [action.timelineId]: {
              ...state.properties[action.timelineId],
              _keyframes: setCurvePointByIndex(
                action.data.heldIndex,
                action.data.newPoint,
                // @ts-ignore
                state.properties[action.timelineId]._keyframes,
              ),
            },
          },
        };
      return state;
    case PropertyReducerActionTypes.COMPUTE_STARTING_BEZIER_POINTS:
      let points: Point[] | undefined = action.data?.points;
      if (points === undefined) {
        points = [
          { x: 50, y: 200 },
          { x: 100, y: 200 },
          { x: 200, y: 200 },
          { x: 300, y: 80 },
          { x: 400, y: 30 },
        ];
      }
      return {
        ...state,
        properties: {
          ...state.properties,
          [action.timelineId]: {
            ...state.properties[action.timelineId],
            _keyframes: computeStartingBezierPoints(points),
          },
        },
      };
    case PropertyReducerActionTypes.CREATE_NEW_PROPERTY:
      return {
        ...state,
        properties: {
          ...state.properties,
          [action.timelineId]: {
            _keyframes: computeStartingBezierPoints(action.data.points),
            animationOptions: action.data.animationOptions,
          },
        },
        propertyMetadata: {
          selectedProperty: action.data.property,
        },
      };
    case PropertyReducerActionTypes.SET_CURVE_POINT_BY_INDEX_PERCENT:
      if (action.timelineId in state.properties) {
        const newPoint: Point = {
          x: action.data.percentage.x * action.data.bezierWidth,
          y: action.data.percentage.y * action.data.bezierWidth,
        };
        return {
          ...state,
          properties: {
            ...state.properties,
            [action.timelineId]: {
              ...state.properties[action.timelineId],
              _keyframes: setCurvePointByIndex(
                { index: action.data.index, field: "pt" },
                newPoint,
                // @ts-ignore
                state.properties[action.timelineId]._keyframes,
              ),
            },
          },
        };
      }
      return state;
    case PropertyReducerActionTypes.SET_SELECTED_PROPERTY:
      return {
        ...state,
        propertyMetadata: {
          selectedProperty: action.data.property,
        },
      };
    case PropertyReducerActionTypes.CREATE_NEW_KEYFRAME:
      let xPos: number;
      if ("horizontalPercentage" in action.data)
        xPos = action.data.horizontalPercentage * action.data.bezierWidth;
      else xPos = action.data.horizontalPixels;
      return {
        ...state,
        properties: {
          ...state.properties,
          [action.timelineId]: {
            // @ts-ignore
            _keyframes: DropNewPoint(state.properties[action.timelineId]._keyframes, xPos),
          },
        },
      };
    case PropertyReducerActionTypes.MODIFY_ANIMATION_OPTIONS:
      return {
        ...state,
        properties: {
          ...state.properties,
          [action.timelineId]: {
            animationOptions: {
              // @ts-ignore
              ...state.properties[action.timelineId].animationOptions,
              ...action.data,
            },
          },
        },
      };
  }
}

export const propertyReducerDefaultState: PropertyData = {
  properties: {},
  propertyMetadata: {
    selectedProperty: undefined,
  },
};
