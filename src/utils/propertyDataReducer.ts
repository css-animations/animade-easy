import { computeStartingBezierPoints, DropNewPoint, setCurvePointByIndex } from "./bezier";
import { AnimationOptions, PropertyData } from "../types/propertyData";
import { AbsoluteBezierPoint, heldItemData, Point } from "../types/bezier";
import { ANIMATABLE_PROPERTIES } from "../components/NewChild";

export enum PropertyReducerActionTypes {
  SET_CURVE_POINT_BY_INDEX = "SET_CURVE_POINT_BY_INDEX",
  SET_CURVE_POINT_BY_INDEX_PERCENT = "SET_CURVE_POINT_BY_INDEX_PERCENT",
  COMPUTE_STARTING_BEZIER_POINTS = "COMPUTE_STARTING_BEZIER_POINTS",
  CREATE_NEW_PROPERTY = "CREATE_NEW_PROPERTY",
  SET_SELECTED_PROPERTY = "SET_SELECTED_PROPERTY",
  CREATE_NEW_KEYFRAME = "CREATE_NEW_KEYFRAME",
  MODIFY_ANIMATION_OPTIONS = "MODIFY_ANIMATION_OPTIONS",
  SET_DURATION = "SET_DURATION",
  SET_DEFAULT_CURVE = "SET_DEFAULT_CURVE",
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
  data: {
    horizontalPixels: number;
  } | {
    horizontalPercentage: number;
    bezierWidth: number;
  };
}

export type PropertyReducerActions =
  | SET_CURVE_BY_INDEX_ACTION
  | SET_CURVE_POINT_BY_INDEX_PERCENT
  | COMPUTE_STARTING_BEZIER_POINTS
  | CREATE_NEW_PROPERTY
  | SET_SELECTED_PROPERTY
  | CREATE_NEW_KEYFRAME;

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
      return {
        ...state,
        properties: {
          ...state.properties,
          [action.timelineId]: {
            ...state.properties[action.timelineId],
            _keyframes: computeStartingBezierPoints(action.data.points),
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
        xPos = action.data.horizontalPercentage * action.data.bezierWidth
      else
        xPos = action.data.horizontalPixels
      return {
        ...state,
        properties: {
          ...state.properties,
          [action.timelineId]: {
            // @ts-ignore
            _keyframes: DropNewPoint(state.properties[action.timelineId]._keyframes, xPos)
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
