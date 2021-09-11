import { Point } from "../types/bezier";

export type Two_Two = [[number, number], [number, number]];
export type Two_One = [[number], [number]];

export function GenRotMat(theta: number): Two_Two {
  return [
    [Math.cos(theta), -Math.sin(theta)],
    [Math.sin(theta), Math.cos(theta)],
  ];
}

export function PointTo21(point: Point): Two_One {
  return [[point.x], [point.y]];
}

export function TwoOneToPoint(two_one: Two_One): Point {
  return {
    x: two_one[0][0],
    y: two_one[1][0],
  }
}

export function m_mul_22x21(two_two: Two_Two, two_one: Two_One): Two_One {
  return [
    [two_two[0][0] * two_one[0][0] + two_two[0][1] * two_one[1][0]],
    [two_two[1][0] * two_one[0][0] + two_two[1][1] * two_one[1][0]],
  ];
}
