import React, { RefObject, useContext, useEffect, useRef, useState } from "react";
import { AbsoluteBezierPoint, heldItemData, Point } from "../types/bezier";
import { Property, PropertyData } from "../types/propertyData";
import { PropertyReducerActions, PropertyReducerActionTypes } from "../utils/propertyDataReducer";
import { ANIMATABLE_PROPERTIES } from "./NewChild";
import { drawDot, GetPointAtT, CreateLUT, AbsoluteLutToPercent } from "../utils/bezier";
import { PropertyDataContext } from "./PropertyDataContext";

type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

function pointCollision(targetPoint: Point, testPoint: Point, distance: number) {
  if (
    Math.abs(targetPoint.x - testPoint.x) < distance &&
    Math.abs(targetPoint.y - testPoint.y) < distance
  )
    return true;
  return false;
}

function drawDebugLines(curves: AbsoluteBezierPoint[], context: CanvasRenderingContext2D) {
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

function drawBezier(curves: AbsoluteBezierPoint[], context: CanvasRenderingContext2D) {
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
  // const lutList = CreateLUT(curves);
  // console.log(AbsoluteLutToPercent(lutList, 1000, 1000));
  // for (const point of lutList) {
  //   drawDot(context, point, 5, "blue");
  // }
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

interface BezierInterface extends CanvasProps {
  currentIndex: number;
}

export function BezierComponent(props: BezierInterface) {
  const { propertyData, dispatchPropertyData } = useContext(PropertyDataContext);

  if (propertyData.propertyMetadata.selectedProperty === undefined) {
    return (
      <div>
        It appears you don't have a property selected! Please select or create one to view and edit
        it's curves.
      </div>
    );
  }

  if (
    propertyData.properties[propertyData.propertyMetadata.selectedProperty] === undefined ||
    propertyData.properties[propertyData.propertyMetadata.selectedProperty]?._keyframes ===
      undefined
  )
    return <div>You must make at least one keyframe.</div>;
  return (
    <InternalBezierComponent
      {...props}
      selectedProperty={
        propertyData.properties[propertyData.propertyMetadata.selectedProperty] as Property
      }
      dispatchPropertyData={dispatchPropertyData}
      currentIndex={props.currentIndex}
      timelineId={propertyData.propertyMetadata.selectedProperty}
    />
  );
}

interface InternalBezierInterface extends CanvasProps {
  selectedProperty: Property;
  dispatchPropertyData: React.Dispatch<PropertyReducerActions>;
  currentIndex: number;
  timelineId: ANIMATABLE_PROPERTIES;
}

export function InternalBezierComponent(props: InternalBezierInterface) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [heldIndex, setHeldIndex] = useState<heldItemData | undefined>(undefined);

  // Currently Selected (from system)
  const [coord, setCoord] = useState<Point>({ x: 0, y: 0 });

  function handleMouseMove(
    canvasRef: RefObject<HTMLCanvasElement>,
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) {
    getMousePos(canvasRef, event, setCoord);
    if (heldIndex !== undefined) {
      props.dispatchPropertyData({
        type: PropertyReducerActionTypes.SET_CURVE_POINT_BY_INDEX,
        data: { heldIndex, newPoint: coord },
        timelineId: props.timelineId,
      });
    }
  }

  function handleMouseDown(
    canvasRef: RefObject<HTMLCanvasElement>,
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) {
    setMouseDown(true);
    getMousePos(canvasRef, event, setCoord);
    for (let index = 0; index < props.selectedProperty._keyframes.length; index++) {
      const relativeBezierPoint = props.selectedProperty._keyframes[index];
      if (pointCollision(relativeBezierPoint.pt, coord, 10)) setHeldIndex({ index, field: "pt" });
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

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas?.getContext("2d") as CanvasRenderingContext2D;
    let animationFrameId: number;

    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#0E2606";
      context.fillRect(0, 0, canvas.width, canvas.height);
      drawBezier(props.selectedProperty._keyframes, context);
      if (mouseDown && heldIndex !== undefined) {
        switch (heldIndex.field) {
          case "pt":
            drawDot(context, props.selectedProperty._keyframes[heldIndex.index].pt, 4, "#0E2606");
            break;
          case "ctrlPt1A":
            drawDot(
              context,
              props.selectedProperty._keyframes[heldIndex.index].ctrlPt1A,
              4,
              "#0E2606",
            );
            break;
          case "ctrlPt2A":
            drawDot(
              context,
              props.selectedProperty._keyframes[heldIndex.index].ctrlPt2A,
              4,
              "#0E2606",
            );
            break;
        }
      }
      animationFrameId = window.requestAnimationFrame(render);
    }

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [heldIndex, props.selectedProperty._keyframes, mouseDown, coord.x, coord.y]);

  return (
    <canvas
      className = "APBezierComponent"
      onMouseMove={(event) => handleMouseMove(canvasRef, event)}
      onMouseDown={(event) => handleMouseDown(canvasRef, event)}
      onMouseOut={handleMouseUp}
      onMouseUp={handleMouseUp}
      ref={canvasRef}
      {...props}
    />
  );
}
