export type MemoryTile = {
    id: number;
    pairId: number;
    isRevealed: boolean;
    isMatched: boolean;
};

export type MemoryGameConfig = {
    rows: number;
    cols: number;
};

export type MemoryGamePublicState = {
    tiles: MemoryTile[];
    rows: number;
    cols: number;
    isInputLocked: boolean;
    movesCount: number;
    isCompleted: boolean;
};


