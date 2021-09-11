import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  computeStartingBezierPoints,
  setCurvePointByIndex,
} from "../utils/bezier";
import { AbsoluteBezierPoint, heldItemData, Point } from "../types/bezier";

type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const largeCurve = [
  {
    pt: { x: 50, y: 50 },
    ctrlPt1R: { x: 10, y: 10 },
    ctrlPt2R: { x: -10, y: -10 },
  },
  {
    pt: { x: 150, y: 50 },
    ctrlPt1R: { x: 30, y: 0 },
    ctrlPt2R: { x: -30, y: 0 },
  },
  {
    pt: { x: 200, y: 100 },
    ctrlPt1R: { x: -20, y: -20 },
    ctrlPt2R: { x: -20, y: -20 },
  },
  {
    pt: { x: 250, y: 50 },
    ctrlPt1R: { x: -20, y: -20 },
    ctrlPt2R: { x: 50, y: 50 },
  },
  {
    pt: { x: 300, y: 300 },
    ctrlPt1R: { x: 20, y: -20 },
    ctrlPt2R: { x: 20, y: -20 },
  },
];

function pointCollision(
  targetPoint: Point,
  testPoint: Point,
  distance: number,
) {
  if (
    Math.abs(targetPoint.x - testPoint.x) < distance &&
    Math.abs(targetPoint.y - testPoint.y) < distance
  )
    return true;
  return false;
}

function drawDot(
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

function drawDebugLines(
  curves: AbsoluteBezierPoint[],
  context: CanvasRenderingContext2D,
) {
  for (let i = 1; i < curves.length - 1; i++) {
    // Line between point 0 and 2
    const zero = i;
    // Parallel line through point 1
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "yellow";
    context.moveTo(curves[zero].ctrlPt1A.x, curves[zero].ctrlPt1A.y);
    context.lineTo(curves[zero].ctrlPt2A.x, curves[zero].ctrlPt2A.y);
    context.stroke();
    context.closePath();
    drawDot(context, curves[zero].ctrlPt1A, 4, "orange");
    drawDot(context, curves[zero].ctrlPt2A, 4, "green");
  }
}

function drawBezier(
  curves: AbsoluteBezierPoint[],
  context: CanvasRenderingContext2D,
) {
  for (const item of curves) {
    drawDot(context, item.pt, 8, "#F1FFF3");
  }

  // Draw debugging lines
  drawDebugLines(curves, context);

  if (curves.length < 1) return;
  context.beginPath();
  context.strokeStyle = "#F1FFF3";
  context.lineWidth = 4;
  context.moveTo(curves[0].pt.x, curves[0].pt.y);
  for (let i = 1; i < curves.length; i++) {
    const curveKey = curves[i];
    context.bezierCurveTo(
      curves[i - 1].ctrlPt2A.x,
      curves[i - 1].ctrlPt2A.y,
      curves[i].ctrlPt1A.x,
      curves[i].ctrlPt1A.y,
      curveKey.pt.x,
      curveKey.pt.y,
    );
    context.moveTo(curveKey.pt.x, curveKey.pt.y);
  }
  context.stroke();
  context.closePath();
}

function getMousePos(
  canvasRef: RefObject<HTMLCanvasElement>,
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  setCoord: React.Dispatch<React.SetStateAction<Point>>,
) {
  const canvas = canvasRef.current as HTMLCanvasElement;
  const rect = canvas.getBoundingClientRect();
  setCoord({
    x: ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  });
}

export function CanvasComponent(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [heldIndex, setHeldIndex] = useState<heldItemData | undefined>(
    undefined,
  );
  const [coord, setCoord] = useState<Point>({ x: 0, y: 0 });
  const [curve, setCurve] = useState<AbsoluteBezierPoint[]>([]);



  function handleMouseMove(
    canvasRef: RefObject<HTMLCanvasElement>,
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) {
    getMousePos(canvasRef, event, setCoord);
    if (heldIndex !== undefined) {
      setCurvePointByIndex(heldIndex, coord, setCurve);
    }
  }

  function handleMouseDown(
    canvasRef: RefObject<HTMLCanvasElement>,
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) {
    setMouseDown(true);
    getMousePos(canvasRef, event, setCoord);
    for (let index = 0; index < curve.length; index++) {
      const relativeBezierPoint = curve[index];
      if (pointCollision(relativeBezierPoint.pt, coord, 10))
        setHeldIndex({ index, field: "pt" });
      else if (pointCollision(relativeBezierPoint.ctrlPt1A, coord, 10))
        setHeldIndex({ index, field: "ctrlPt1A" });
      else if (pointCollision(relativeBezierPoint.ctrlPt2A, coord, 10))
        setHeldIndex({ index, field: "ctrlPt2A" });
    }
  }

  function handleMouseUp() {
    setMouseDown(false);
    setHeldIndex(undefined);
  }

  // Quickly calculates the correct bezier points from the starting points
  useEffect(() => {
    const points: Point[] = [
      { x: 20, y: 400 },
      { x: 100, y: 350 },
      { x: 200, y: 200 },
      { x: 300, y: 80 },
      { x: 400, y: 30 },
    ];

    setCurve(computeStartingBezierPoints(points));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas?.getContext("2d") as CanvasRenderingContext2D;
    let animationFrameId: number;

    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#0E2606";
      context.fillRect(0, 0, canvas.width, canvas.height);
      drawBezier(curve, context);
      if (mouseDown && heldIndex !== undefined) {
        switch (heldIndex.field) {
          case "pt":
            drawDot(context, curve[heldIndex.index].pt, 4, "#0E2606");
            break;
          case "ctrlPt1A":
            drawDot(context, curve[heldIndex.index].ctrlPt1A, 4, "#0E2606");
            break;
          case "ctrlPt2A":
            drawDot(context, curve[heldIndex.index].ctrlPt2A, 4, "#0E2606");
            break;
        }
      }
      animationFrameId = window.requestAnimationFrame(render);
    }

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [heldIndex, curve, mouseDown, coord.x, coord.y]);

  return (
    <canvas
      onMouseMove={(event) => handleMouseMove(canvasRef, event)}
      onMouseDown={(event) => handleMouseDown(canvasRef, event)}
      onMouseUp={handleMouseUp}
      ref={canvasRef}
      {...props}
    />
  );
}
