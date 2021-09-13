export interface Point {
  x: number;
  y: number;
}

export interface RelativeBezierPoint {
  pt: Point;
  ctrlPt1R: Point;
  ctrlPt2R: Point
}

export interface AbsoluteBezierPoint {
  pt: Point;
  ctrlPt1A: Point;
  ctrlPt2A: Point;
}

export interface heldItemData {
  index: number;
  field: keyof AbsoluteBezierPoint;
}
