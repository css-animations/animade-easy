import React, {RefObject, useEffect, useReducer, useRef, useState} from "react";

type CanvasProps = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>

interface Point {
  x: number;
  y: number;
}

interface RelativeBezierPoint {
  pt: Point;
  ctrlPt1R: Point;
  ctrlPt2R: Point
}

interface AbsoluteBezierPoint {
  pt: Point;
  ctrlPt1A: Point;
  ctrlPt2A: Point
}

function DeepCopyBezierPoint(point: RelativeBezierPoint): RelativeBezierPoint {
  return {
    pt: {...point.pt},
    ctrlPt1R: {...point.ctrlPt1R},
    ctrlPt2R: {...point.ctrlPt2R},
  }
}

function MoveBezierPoint(point: RelativeBezierPoint, offsetX: number, offsetY: number): RelativeBezierPoint {
  return {
    ...point,
    pt: {
      x: point.pt.x + offsetX,
      y: point.pt.y + offsetY,
    }
  }
}

function pointCollision(targetPoint: Point, testPoint: Point, distance: number) {
  if (Math.abs(targetPoint.x - testPoint.x) < distance && Math.abs(targetPoint.y - testPoint.y) < distance)
    return true
  return false
}

function GetFullBezierPoint(point: RelativeBezierPoint): AbsoluteBezierPoint {
  return {
    pt: {...point.pt},
    ctrlPt1A: {
      x: point.pt.x + point.ctrlPt1R.x,
      y: point.pt.y + point.ctrlPt1R.y,
    },
    ctrlPt2A: {
      x: point.pt.x + point.ctrlPt2R.x,
      y: point.pt.y + point.ctrlPt2R.y,
    }
  }
}

function drawDot(context: CanvasRenderingContext2D, point: Point, size: number, color: string | CanvasGradient | CanvasPattern) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(point.x, point.y, size, 0, Math.PI * 2, true);
  context.fill();
}

export function CanvasComponent(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouseDown, setMouseDown] = useState<boolean>(false)
  const [heldIndex, setHeldIndex] = useState<number | undefined>(undefined)
  const [coord, setCoord] = useState<Point>({x: 0, y: 0})
  const [curve, setCurve] = useState<RelativeBezierPoint[]>([
    {
      pt: {x: 50, y: 50},
      ctrlPt1R: {x: 10, y: 10},
      ctrlPt2R: {x: -10, y: -10}
    },
    {
      pt: {x: 150, y: 50},
      ctrlPt1R: {x: 30, y: 0},
      ctrlPt2R: {x: -30, y: 0}
    },
    {
      pt: {x: 200, y: 100},
      ctrlPt1R: {x: -20, y: -20},
      ctrlPt2R: {x: -20, y: -20}
    },
    {
      pt: {x: 250, y: 50},
      ctrlPt1R: {x: -20, y: -20},
      ctrlPt2R: {x: 50, y: 50}
    },
    {
      pt: {x: 300, y: 300},
      ctrlPt1R: {x: 20, y: -20},
      ctrlPt2R: {x: 20, y: -20}
    }
  ]);

  function setCurvePointByIndex(index: number, newPoint: Point) {
    setCurve(prevCurve => prevCurve.map((pt, ind) => {
      if (ind === index) {
        return {
          ...pt,
          pt: newPoint
        }
      } else return pt
    }))
  }

  function getMousePos(canvasRef: RefObject<HTMLCanvasElement>, event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const canvas = canvasRef.current as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    setCoord({
      x: (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    })
  }

  function handleMouseMove(canvasRef: RefObject<HTMLCanvasElement>, event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    getMousePos(canvasRef, event);
    if (heldIndex !== undefined) {
      setCurvePointByIndex(heldIndex, coord)
    }
  }

  function handleMouseDown(canvasRef: RefObject<HTMLCanvasElement>, event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    setMouseDown(true);
    getMousePos(canvasRef, event);
    for (let i = 0; i < curve.length; i++) {
      const relativeBezierPoint = curve[i];
      if (pointCollision(relativeBezierPoint.pt, coord, 10)) setHeldIndex(i);
    }
  }

  function handleMouseUp() {
    setMouseDown(false);
    setHeldIndex(undefined);
  }

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const context = canvas?.getContext('2d') as CanvasRenderingContext2D
    let animationFrameId: number;


    function drawBezier(curves: RelativeBezierPoint[]) {
      context.beginPath();
      context.strokeStyle = "#F1FFF3"
      context.lineWidth = 4;
      context.moveTo(curves[0].pt.x, curves[0].pt.y)
      for (let i = 1; i < curves.length; i++) {
        const curveKey = GetFullBezierPoint(curves[i]);
        context.bezierCurveTo(curveKey.ctrlPt1A.x, curveKey.ctrlPt1A.y, curveKey.ctrlPt2A.x, curveKey.ctrlPt2A.y, curveKey.pt.x, curveKey.pt.y)
        context.moveTo(curveKey.pt.x, curveKey.pt.y);
        context.stroke();
      }
      context.closePath();
      for (const item of curves) {
        drawDot(context, item.pt, 8, "#F1FFF3")
      }
    }

    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#0E2606"
      context.fillRect(0, 0, canvas.width, canvas.height);
      drawBezier(curve);
      if (mouseDown && heldIndex !== undefined) {
        drawDot(context, curve[heldIndex].pt, 4, "#0E2606")
      }
      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [curve, mouseDown, coord.x, coord.y])

  return (
      <canvas onMouseMove={event => handleMouseMove(canvasRef, event)}
              onMouseDown={event => handleMouseDown(canvasRef, event)} onMouseUp={handleMouseUp}
              ref={canvasRef} {...props}/>
  )
}
