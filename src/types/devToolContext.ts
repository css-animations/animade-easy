import { ANIMATABLE_PROPERTIES } from "../components/NewChild";

export interface AnimationPropertyType {
  animationName: string;
  animationTypes: AnimationTypeDatum[];
  duration: string;
  direction?: string;
  iterationCount?: string;
  fillMode?: string;
}

interface AnimationTypeDatum {
  animationType: ANIMATABLE_PROPERTIES;
  formatFunction: (percentage: number) => string;
}

export const ScaleTypeAnimation: AnimationTypeDatum = {
  animationType: ANIMATABLE_PROPERTIES.scale,
  formatFunction: (percentage: number): string =>
    `transform: scale(${percentage});`,
};
export const RotateTypeAnimation: AnimationTypeDatum = {
  animationType: ANIMATABLE_PROPERTIES.rotate,
  formatFunction: (percentage: number) => `transform: rotate(${percentage}deg);`,
};
