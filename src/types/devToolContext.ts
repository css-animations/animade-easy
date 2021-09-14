import { ANIMATABLE_PROPERTIES } from "../components/NewChild";
import { AnimationOptions } from "./propertyData";

export interface AnimationPropertyType extends AnimationOptions {
  animationName: string;
  animationTypes: AnimationTypeDatum[];
  duration: "5s";
}

interface AnimationTypeDatum {
  animationType: ANIMATABLE_PROPERTIES;
  formatFunction: (percentage: number) => string;
}

export const ScaleTypeAnimation: AnimationTypeDatum = {
  animationType: ANIMATABLE_PROPERTIES.scale,
  formatFunction: (percentage: number): string => `scale(${percentage}) `,
};
export const RotateTypeAnimation: AnimationTypeDatum = {
  animationType: ANIMATABLE_PROPERTIES.rotate,
  formatFunction: (percentage: number) => `rotate(${percentage * 100}deg) `,
};
