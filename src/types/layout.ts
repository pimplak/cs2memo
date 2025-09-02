export type TileRect = {
    x: number; // left in CSS px
    y: number; // top in CSS px
    width: number;
    height: number;
};

export type GridLayout = {
    rects: TileRect[]; // index corresponds to tile index
    padding: number;
    gap: number;
    boardRect: { x: number; y: number; width: number; height: number };
};


