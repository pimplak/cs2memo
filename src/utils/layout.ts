import type { GridLayout, TileRect } from '@/types/layout';

export function computeGridLayout(
    canvasWidth: number,
    canvasHeight: number,
    rows: number,
    cols: number,
    options?: { padding?: number; gap?: number; aspect?: number }
): GridLayout {
    const padding = options?.padding ?? 16;
    const gap = options?.gap ?? 12;
    const aspect = options?.aspect ?? 0.72; // card aspect ratio (width/height)

    const boardX = padding;
    const boardY = padding;
    const boardWidth = Math.max(0, canvasWidth - padding * 2);
    const boardHeight = Math.max(0, canvasHeight - padding * 2);

    // Compute tile size to fit grid respecting aspect ratio
    const totalGapX = gap * (cols - 1);
    const totalGapY = gap * (rows - 1);
    const maxTileWidth = (boardWidth - totalGapX) / cols;
    const maxTileHeight = (boardHeight - totalGapY) / rows;

    // Fit by height considering aspect
    let tileWidth = Math.min(maxTileWidth, maxTileHeight * aspect);
    let tileHeight = tileWidth / aspect;

    // Center board area with computed tiles
    const gridWidth = cols * tileWidth + totalGapX;
    const gridHeight = rows * tileHeight + totalGapY;
    const offsetX = boardX + (boardWidth - gridWidth) / 2;
    const offsetY = boardY + (boardHeight - gridHeight) / 2;

    const rects: TileRect[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = offsetX + c * (tileWidth + gap);
            const y = offsetY + r * (tileHeight + gap);
            rects.push({ x, y, width: tileWidth, height: tileHeight });
        }
    }

    return {
        rects,
        padding,
        gap,
        boardRect: { x: boardX, y: boardY, width: boardWidth, height: boardHeight },
    };
}

export function hitTestTile(rects: TileRect[], x: number, y: number): number {
    for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) {
            return i;
        }
    }
    return -1;
}


