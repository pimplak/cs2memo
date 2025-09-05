import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import type { MemoryGameConfig, MemoryGamePublicState } from '@/types/memory';
import { createRng, createPairIds } from '@/services/SeedGenerator';

function createShuffledPairIds(totalTiles: number, seed?: string | number): number[] {
    const rng = createRng(seed);
    return createPairIds(totalTiles, rng);
}

export function useMemoryGame(initialConfig: MemoryGameConfig) {
    const STORAGE_KEY = 'cs2memo:game';

    const state = reactive<MemoryGamePublicState>({
        tiles: [],
        rows: initialConfig.rows,
        cols: initialConfig.cols,
        isInputLocked: false,
        movesCount: 0,
        isCompleted: false,
        elapsedMs: 0,
        isPaused: true,
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
        state.elapsedMs = 0;
        state.isPaused = true;
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
        saveToStorage();
    }

    function revealTileByIndex(tileIndex: number): void {
        if (state.isCompleted || state.isInputLocked || state.isPaused) return;
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
                pauseTimer();
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

    function tickTimer(deltaMs: number): void {
        if (state.isPaused || state.isCompleted) return;
        if (deltaMs > 0 && Number.isFinite(deltaMs)) {
            state.elapsedMs += deltaMs;
        }
    }

    function pauseTimer(): void {
        state.isPaused = true;
    }

    function resumeTimer(): void {
        if (!state.isCompleted) {
            state.isPaused = false;
        }
    }

    function togglePause(): void {
        state.isPaused = !state.isPaused;
    }

    function resetTimer(): void {
        state.elapsedMs = 0;
    }

    const tileCount = computed(() => state.rows * state.cols);
    const matchedCount = computed(() => state.tiles.filter((t) => t.isMatched).length);

    onBeforeUnmount(() => {
        if (compareTimeoutHandle.value != null) {
            window.clearTimeout(compareTimeoutHandle.value);
        }
    });

    function saveToStorage(): void {
        try {
            if (typeof window === 'undefined') return;
            const snapshot = {
                tiles: state.tiles.map((t) => ({ id: t.id, pairId: t.pairId, isRevealed: t.isRevealed, isMatched: t.isMatched })),
                rows: state.rows,
                cols: state.cols,
                isInputLocked: false, // do not persist lock state
                movesCount: state.movesCount,
                isCompleted: state.isCompleted,
                elapsedMs: state.elapsedMs,
                isPaused: state.isPaused,
                seed: state.seed,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        } catch {
            // ignore storage errors
        }
    }

    function loadFromStorage(): boolean {
        try {
            if (typeof window === 'undefined') return false;
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            const saved = JSON.parse(raw) as Partial<MemoryGamePublicState> & { tiles?: { id: number; pairId: number; isRevealed: boolean; isMatched: boolean }[] };
            if (!saved || typeof saved.rows !== 'number' || typeof saved.cols !== 'number') return false;
            // Only restore if the saved grid matches the requested one (to avoid fighting with props-driven size)
            if (saved.rows !== initialConfig.rows || saved.cols !== initialConfig.cols) return false;
            const totalTiles = saved.rows * saved.cols;
            if (!Array.isArray(saved.tiles) || saved.tiles.length !== totalTiles) return false;

            state.rows = saved.rows;
            state.cols = saved.cols;
            state.seed = saved.seed;
            state.isInputLocked = false;
            state.movesCount = typeof saved.movesCount === 'number' ? saved.movesCount : 0;
            state.isCompleted = !!saved.isCompleted;
            state.elapsedMs = typeof saved.elapsedMs === 'number' ? saved.elapsedMs : 0;
            state.isPaused = saved.isPaused ?? true;
            firstRevealedIndex.value = null;
            if (compareTimeoutHandle.value != null) {
                window.clearTimeout(compareTimeoutHandle.value);
                compareTimeoutHandle.value = null;
            }
            state.tiles = saved.tiles.map((t, index) => ({
                id: index,
                pairId: t.pairId,
                isRevealed: !!t.isRevealed,
                isMatched: !!t.isMatched,
            }));

            const nonMatchedRevealed: number[] = [];
            for (let i = 0; i < state.tiles.length; i++) {
                const t = state.tiles[i];
                if (t.isRevealed && !t.isMatched) nonMatchedRevealed.push(i);
            }
            if (nonMatchedRevealed.length === 1) {
                firstRevealedIndex.value = nonMatchedRevealed[0];
            } else if (nonMatchedRevealed.length >= 2) {
                for (const idx of nonMatchedRevealed) {
                    state.tiles[idx].isRevealed = false;
                }
                firstRevealedIndex.value = null;
            }
            return true;
        } catch {
            return false;
        }
    }

    // Persist on changes (deep watch)
    watch(
        () => ({
            tiles: state.tiles.map((t) => ({ id: t.id, pairId: t.pairId, isRevealed: t.isRevealed, isMatched: t.isMatched })),
            rows: state.rows,
            cols: state.cols,
            movesCount: state.movesCount,
            isCompleted: state.isCompleted,
            elapsedMs: state.elapsedMs,
            isPaused: state.isPaused,
            seed: state.seed,
        }),
        () => saveToStorage(),
        { deep: true }
    );

    // Initialize from storage or start a new game
    if (!loadFromStorage()) {
        newGame();
    }

    return {
        state,
        tileCount,
        matchedCount,
        newGame,
        revealTileByIndex,
        resetRevealsInstant,
        tickTimer,
        pauseTimer,
        resumeTimer,
        togglePause,
        resetTimer,
    };
}


