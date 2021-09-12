import { computeStartingBezierPoints, setCurvePointByIndex } from "./bezier";
import {
  AnimationOptions,
  PropertyData,
  PropertyType,
} from "../types/propertyData";
import { AbsoluteBezierPoint, heldItemData, Point } from "../types/bezier";

export enum PropertyReducerActionTypes {
  SET_CURVE_POINT_BY_INDEX = "SET_CURVE_POINT_BY_INDEX",
  SET_CURVE_POINT_BY_INDEX_PERCENT = "SET_CURVE_POINT_BY_INDEX_PERCENT",
  COMPUTE_STARTING_BEZIER_POINTS = "COMPUTE_STARTING_BEZIER_POINTS",
  CREATE_NEW_PROPERTY = "CREATE_NEW_PROPERTY",
  CREATE_NEW_KEYFRAME = "CREATE_NEW_KEYFRAME",
  MODIFY_ANIMATION_OPTIONS = "MODIFY_ANIMATION_OPTIONS",
}

interface GeneralPropertyReducerActions {
  timelineId: PropertyType;
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
    animationOptions?: AnimationOptions;
    _keyframes: AbsoluteBezierPoint[];
  };
}

interface SET_CURVE_POINT_BY_INDEX_PERCENT
  extends GeneralPropertyReducerActions {
  type: PropertyReducerActionTypes.SET_CURVE_POINT_BY_INDEX_PERCENT;
  data: {
    percentage: Point;
    index: number;
    bezierWidth: number;
    bezierHeight: number;
  };
}

export type PropertyReducerActions =
  | SET_CURVE_BY_INDEX_ACTION
  | SET_CURVE_POINT_BY_INDEX_PERCENT
  | COMPUTE_STARTING_BEZIER_POINTS
  | CREATE_NEW_PROPERTY;

export function propertyReducer(
  state: PropertyData,
  action: PropertyReducerActions,
): PropertyData {
  switch (action.type) {
    case PropertyReducerActionTypes.SET_CURVE_POINT_BY_INDEX:
      if (action.timelineId in state.properties)
        return {
          ...state,
          [action.timelineId]: {
            ...state.properties[action.timelineId],
            _keyframes: setCurvePointByIndex(
              action.data.heldIndex,
              action.data.newPoint,
              // @ts-ignore
              state.properties[action.timelineId]._keyframes,
            ),
          },
        };
      return state;
    case PropertyReducerActionTypes.COMPUTE_STARTING_BEZIER_POINTS:
      return {
        ...state,
        [action.timelineId]: {
          ...state.properties[action.timelineId],
          _keyframes: computeStartingBezierPoints(action.data.points),
        },
      };
    case PropertyReducerActionTypes.CREATE_NEW_PROPERTY:
      return {
        ...state,
        [action.timelineId]: {
          _keyframes: action.data._keyframes,
          animationOptions: action.data.animationOptions,
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
          [action.timelineId]: {
            ...state.properties[action.timelineId],
            _keyframes: setCurvePointByIndex(
              { index: action.data.index, field: "pt" },
              newPoint,
              // @ts-ignore
              state.properties[action.timelineId]._keyframes,
            ),
          },
        };
      }
      return state;
    default:
      throw new Error("Bad action thrown");
  }
}

export const propertyReducerDefaultState: PropertyData = {
  properties: {},
  propertyMetadata: {
    selectedProperty: undefined,
  },
};
