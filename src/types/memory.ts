import type { CS2Rarity } from '@/types/cs2';

export enum GameDifficulty {
    Easy = 'easy',
    Medium = 'medium',
    Hard = 'hard',
    Expert = 'expert'
}

export interface GameRecord {
    id: string;
    completedAt: Date;
    movesCount: number;
    elapsedMs: number;
    difficulty: GameDifficulty;
    seed?: string | number;
}

export type MemoryTile = {
    id: number;
    pairId: number;
    isRevealed: boolean;
    isMatched: boolean;
    itemId: string;
    rarity: CS2Rarity;
};

export type MemoryGameConfig = {
    rows: number;
    cols: number;
    seed?: string | number;
};

export type MemoryGamePublicState = {
    tiles: MemoryTile[];
    rows: number;
    cols: number;
    isInputLocked: boolean;
    movesCount: number;
    isCompleted: boolean;
    elapsedMs: number;
    isPaused: boolean;
    seed?: string | number;
};


/**
 * Gets grid dimensions for a difficulty level
 */
export function getGridFromDifficulty(difficulty: GameDifficulty): { rows: number; cols: number } {
    switch (difficulty) {
        case GameDifficulty.Easy:
            return { rows: 4, cols: 3 };
        case GameDifficulty.Medium:
            return { rows: 4, cols: 4 };
        case GameDifficulty.Hard:
            return { rows: 6, cols: 4 };
        case GameDifficulty.Expert:
            return { rows: 6, cols: 6 };
        default:
            return { rows: 4, cols: 4 };
    }
}
