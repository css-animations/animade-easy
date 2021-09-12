import {
  AbsoluteBezierPoint,
  heldItemData,
  Point,
  RelativeBezierPoint,
} from "../types/bezier";
import { magnitude, neg, pt, unitVector, vec, vecMul } from "./vectors";

function getControlPoints(
  zero: Point,
  one: Point,
  two: Point,
  t: number,
): [Point, Point] {
  const d01 = Math.sqrt(
    Math.pow(one.x - zero.x, 2) + Math.pow(one.y - zero.y, 2),
  );
  const d12 = Math.sqrt(
    Math.pow(two.x - one.x, 2) + Math.pow(two.y - one.y, 2),
  );
  const fa = (t * d01) / (d01 + d12); // scaling factor for triangle Ta
  const fb = (t * d12) / (d01 + d12); // ditto for Tb, simplifies to fb=t-fa
  const p1x = one.x - fa * (two.x - zero.x); // x2-x0 is the width of triangle T
  const p1y = one.y - fa * (two.y - zero.y); // y2-y0 is the height of T
  const p2x = one.x + fb * (two.x - zero.x);
  const p2y = one.y + fb * (two.y - zero.y);
  return [
    { x: p1x, y: p1y },
    { x: p2x, y: p2y },
  ];
}

export function computeStartingBezierPoints(points: Point[]) {
  const bezierPoints: AbsoluteBezierPoint[] = [
    {
      pt: points[0],
      ctrlPt1A: points[0],
      ctrlPt2A: points[0],
    },
  ];

  for (let i = 0; i < points.length - 2; i++) {
    // Line between point 0 and 2
    const zero = i;
    const one = i + 1;
    const two = i + 2;

    // Parallel line through point 1
    const pts = getControlPoints(points[zero], points[one], points[two], 0.5);
    bezierPoints.push({
      pt: points[one],
      ctrlPt1A: pts[0],
      ctrlPt2A: pts[1],
    });
  }
  bezierPoints.push({
    pt: points[points.length - 1],
    ctrlPt1A: points[points.length - 1],
    ctrlPt2A: points[points.length - 1],
  });
  return bezierPoints;
}

/*
 * Calculates the y value of a point along the line defined by `point` and `slope` at x coord `x`.
 * */
function pointSlopePointExtractor(
  point: Point,
  slope: number,
  x: number,
): number {
  return slope * (x - point.x) + point.y;
}

function parallelPoints(
  points: Point[],
  two: number,
  zero: number,
  one: number,
) {
  const slope =
    (points[two].y - points[zero].y) / (points[two].x - points[zero].x);
  const offset = 30;
  const parallel_pt1: Point = {
    x: points[one].x - offset,
    y: pointSlopePointExtractor(points[one], slope, points[one].x - offset),
  };
  const parallel_pt2: Point = {
    x: points[one].x + offset,
    y: pointSlopePointExtractor(points[one], slope, points[one].x + offset),
  };
  return { parallel_pt1, parallel_pt2 };
}

function DeepCopyBezierPoint(point: RelativeBezierPoint): RelativeBezierPoint {
  return {
    pt: { ...point.pt },
    ctrlPt1R: { ...point.ctrlPt1R },
    ctrlPt2R: { ...point.ctrlPt2R },
  };
}

function MoveBezierPoint(
  point: RelativeBezierPoint,
  offsetX: number,
  offsetY: number,
): RelativeBezierPoint {
  return {
    ...point,
    pt: {
      x: point.pt.x + offsetX,
      y: point.pt.y + offsetY,
    },
  };
}

function GetAbsoluteBezierPoint(
  point: RelativeBezierPoint,
): AbsoluteBezierPoint {
  return {
    pt: { ...point.pt },
    ctrlPt1A: {
      x: point.pt.x + point.ctrlPt1R.x,
      y: point.pt.y + point.ctrlPt1R.y,
    },
    ctrlPt2A: {
      x: point.pt.x + point.ctrlPt2R.x,
      y: point.pt.y + point.ctrlPt2R.y,
    },
  };
}

export function GetRelativeBezierPoint(
  point: AbsoluteBezierPoint,
): RelativeBezierPoint {
  return {
    pt: { ...point.pt },
    ctrlPt1R: GetRelativePoint(point.pt, point.ctrlPt1A),
    ctrlPt2R: GetRelativePoint(point.pt, point.ctrlPt2A),
  };
}

export function GetRelativePoint(center: Point, absPoint: Point): Point {
  return {
    x: absPoint.x - center.x,
    y: absPoint.y - center.y,
  };
}

export function GetAbsolutePoint(center: Point, relPoint: Point): Point {
  return {
    x: center.x + relPoint.x,
    y: center.y + relPoint.y,
  };
}

export function setCurvePointByIndex(
  heldIndex: heldItemData,
  newPoint: Point,
  prevCurve: AbsoluteBezierPoint[],
): AbsoluteBezierPoint[] {
  switch (heldIndex.field) {
    case "pt":
      return prevCurve.map((pt, ind) => {
        if (ind === heldIndex.index) {
          const delta_x = pt.pt.x - newPoint.x;
          const delta_y = pt.pt.y - newPoint.y;
          return {
            pt: newPoint,
            ctrlPt1A: {
              x: pt.ctrlPt1A.x - delta_x,
              y: pt.ctrlPt1A.y - delta_y,
            },
            ctrlPt2A: {
              x: pt.ctrlPt2A.x - delta_x,
              y: pt.ctrlPt2A.y - delta_y,
            },
          };
        } else return pt;
      });
    // Orange
    case "ctrlPt1A":
      return prevCurve.map((prevPoint, ind) => {
        if (ind === heldIndex.index) {
          const { ctrlPt2R: drivenPoint } = GetRelativeBezierPoint(prevPoint);
          const relCurrentPt = GetRelativePoint(prevPoint.pt, newPoint);
          const newPointUnitVector = unitVector(vec(relCurrentPt));
          const drivenPointMag = magnitude(vec(drivenPoint));
          const newDrivenPoint = pt(
            vecMul(neg(newPointUnitVector), drivenPointMag),
          );
          return {
            pt: prevPoint.pt,
            ctrlPt1A: newPoint,
            ctrlPt2A: GetAbsolutePoint(prevPoint.pt, newDrivenPoint),
          };
        } else return prevPoint;
      });
    case "ctrlPt2A":
      return prevCurve.map((prevPoint, ind) => {
        if (ind === heldIndex.index) {
          const { ctrlPt1R: drivenPoint } = GetRelativeBezierPoint(prevPoint);
          const relCurrentPt = GetRelativePoint(prevPoint.pt, newPoint);
          const newPointUnitVector = unitVector(vec(relCurrentPt));
          const drivenPointMag = magnitude(vec(drivenPoint));
          const newDrivenPoint = pt(
            vecMul(neg(newPointUnitVector), drivenPointMag),
          );
          return {
            pt: prevPoint.pt,
            ctrlPt2A: newPoint,
            ctrlPt1A: GetAbsolutePoint(prevPoint.pt, newDrivenPoint),
          };
        } else return prevPoint;
      });
  }
}

// function getAtPoint(curve: AbsoluteBezierPoint[]): Point
//
// export function generateCurveLUT(curve: AbsoluteBezierPoint[], context: CanvasRenderingContext2D) {
//
// }

export function GetPointAtT(
  t: number,
  leftPoint: AbsoluteBezierPoint,
  rightPoint: AbsoluteBezierPoint,
): Point {
  const t0 = -(t * t * t) + 3 * t * t - 3 * t + 1;
  const t1 = 3 * t * t * t - 6 * t * t + 3 * t;
  const t2 = -(3 * t * t * t) + 3 * t * t;
  const t3 = t * t * t;
  return {
    x:
      leftPoint.pt.x * t0 +
      leftPoint.ctrlPt2A.x * t1 +
      rightPoint.ctrlPt1A.x * t2 +
      rightPoint.pt.x * t3,
    y:
      leftPoint.pt.y * t0 +
      leftPoint.ctrlPt2A.y * t1 +
      rightPoint.ctrlPt1A.y * t2 +
      rightPoint.pt.y * t3,
  };
}

export function CreateLUT(
  curve: AbsoluteBezierPoint[],
  num_steps: number = 20
): Point[][] {
  const pointArr: Point[][] = [];
  for (let i = 0; i < curve.length - 1; i++) {
    const subPointArr = []
    for (let j = 1; j < num_steps; j++) {
      const point = GetPointAtT(j / num_steps, curve[i], curve[i + 1]);
      subPointArr.push(point);
    }
    pointArr.push(subPointArr)
  }
  return pointArr;
}

// Drops a point on the bezier curve array exactly in place where it should be,
// without disrupting the existing curve
// export function DropNewPoint(curve: AbsoluteBezierPoint[], xPos: number): AbsoluteBezierPoint[] {
//   let y_pos: number;
//   const lut = CreateLUT(curve)
//   for (let i = 1; i < lut.length; i++) {
//     if (lut[i].x > xPos) {
//       y_pos = (lut[i-1].y - lut[i].y)/2
//     }
//   }
//   // TODO: Determine y position
//   // TODO: Determine the drag handle position without recomputing whole path
//   return [];
// }

export function drawDot(
  context: CanvasRenderingContext2D,
  point: Point,
  size: number,
  color: string | CanvasGradient | CanvasPattern,
) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(point.x, point.y, size, 0, Math.PI * 2, true);
  context.fill();
}
