import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import type { MemoryGameConfig, MemoryGamePublicState } from '@/types/memory';
import { createRng, createPairIds } from '@/services/SeedGenerator';

function createShuffledPairIds(totalTiles: number, seed?: string | number): number[] {
    const rng = createRng(seed);
    return createPairIds(totalTiles, rng);
}

export function useMemoryGame(initialConfig: MemoryGameConfig) {
    const state = reactive<MemoryGamePublicState>({
        tiles: [],
        rows: initialConfig.rows,
        cols: initialConfig.cols,
        isInputLocked: false,
        movesCount: 0,
        isCompleted: false,
        seed: initialConfig.seed,
    });

    const firstRevealedIndex = ref<number | null>(null);
    const compareTimeoutHandle = ref<number | null>(null);

    function newGame(config?: Partial<MemoryGameConfig>): void {
        const rows = config?.rows ?? state.rows;
        const cols = config?.cols ?? state.cols;
        const seed = config?.seed ?? state.seed;
        const totalTiles = rows * cols;
        if (totalTiles % 2 !== 0) {
            throw new Error('Total number of tiles must be even');
        }

        state.rows = rows;
        state.cols = cols;
        state.seed = seed;
        state.isInputLocked = false;
        state.movesCount = 0;
        state.isCompleted = false;
        firstRevealedIndex.value = null;
        if (compareTimeoutHandle.value != null) {
            window.clearTimeout(compareTimeoutHandle.value);
            compareTimeoutHandle.value = null;
        }

        const pairIds = createShuffledPairIds(totalTiles, seed);
        state.tiles = pairIds.map((pairId, index) => ({
            id: index,
            pairId,
            isRevealed: false,
            isMatched: false,
        }));
    }

    function revealTileByIndex(tileIndex: number): void {
        if (state.isCompleted || state.isInputLocked) return;
        if (tileIndex < 0 || tileIndex >= state.tiles.length) return;
        const tile = state.tiles[tileIndex];
        if (tile.isMatched || tile.isRevealed) return;

        tile.isRevealed = true;

        if (firstRevealedIndex.value == null) {
            firstRevealedIndex.value = tileIndex;
            return;
        }

        // Second tile revealed → lock input and compare after short delay
        const firstIndex = firstRevealedIndex.value;
        firstRevealedIndex.value = null;
        state.isInputLocked = true;
        state.movesCount += 1;

        const firstTile = state.tiles[firstIndex];
        const secondTile = tile;

        compareTimeoutHandle.value = window.setTimeout(() => {
            if (firstTile.pairId === secondTile.pairId) {
                firstTile.isMatched = true;
                secondTile.isMatched = true;
            } else {
                firstTile.isRevealed = false;
                secondTile.isRevealed = false;
            }

            state.isInputLocked = false;

            // Check completion
            const allMatched = state.tiles.every((t) => t.isMatched);
            if (allMatched) {
                state.isCompleted = true;
            }
        }, 600); // brief display period for UX; animation handled elsewhere
    }

    function resetRevealsInstant(): void {
        // utility to force-close all non-matched tiles (not required in core flow)
        for (const t of state.tiles) {
            if (!t.isMatched) t.isRevealed = false;
        }
        firstRevealedIndex.value = null;
        if (compareTimeoutHandle.value != null) {
            window.clearTimeout(compareTimeoutHandle.value);
            compareTimeoutHandle.value = null;
        }
        state.isInputLocked = false;
    }

    const tileCount = computed(() => state.rows * state.cols);
    const matchedCount = computed(() => state.tiles.filter((t) => t.isMatched).length);

    onBeforeUnmount(() => {
        if (compareTimeoutHandle.value != null) {
            window.clearTimeout(compareTimeoutHandle.value);
        }
    });

    // Initialize
    newGame();

    return {
        state,
        tileCount,
        matchedCount,
        newGame,
        revealTileByIndex,
        resetRevealsInstant,
    };
}


