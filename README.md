# CS2 Memo

A memory matching game themed around CS2 items. Built with Vue 3, TypeScript, Pinia, Vue Router and a Canvas-based renderer for smooth animations and precise input handling.

## Quick start

```sh
yarn
yarn dev
```

## Scripts

- `yarn dev`: start Vite dev server with HMR
- `yarn build`: type-check and build for production
- `yarn preview`: preview the production bundle
- `yarn test:unit`: run unit tests (Vitest)
- `yarn lint`: run ESLint with autofix
- `yarn format`: format sources with Prettier
- `yarn type-check`: run type checking (vue-tsc)

## Code documentation

### Architecture and flow

- **Entry**: `src/main.ts` creates the app, registers Pinia and Router, mounts `#app`.
- **Routing**: `src/router/index.ts` defines routes: `/` (Menu), `/game` (Game), `/history` (History).
- **Root UI**: `src/App.vue` renders the routed views via `<router-view />`.

### Key modules

- **Composables**
  - `src/composables/useMemoryGame.ts` – core game logic (state, moves, matching, timer, pause, result persistence).
    - Public state (`MemoryGamePublicState`): `tiles`, `rows`, `cols`, `isInputLocked`, `movesCount`, `isCompleted`, `elapsedMs`, `isPaused`, `seed`.
    - API: `newGame(config?)`, `revealTileByIndex(index)`, `togglePause()`, `resumeTimer()`, `tickTimer()`.
    - Deterministic randomness: `SeedGenerator` (`createRng`, `createPairIds`, `seededShuffle`).
    - Tile content: `data/cs2Catalog.ts` items and rarities.
    - Persistence: state/records saved in `localStorage` under `cs2memo:game` (records via history store).
  - `src/composables/useCanvasRenderer.ts` – Canvas lifecycle: refs, render loop, DPI scaling, pointer handling. Exposes `containerRef`, `canvasRef`, `renderCallback`, `pointerHandlers`.

- **Services**
  - `src/services/CanvasService.ts` – Canvas engine: animation loop (`requestAnimationFrame`), `devicePixelRatio` scaling, size observation, pointer events.
  - `src/services/ImageLoader.ts` – image loading with simple in-memory cache; singleton via `getImageLoader()`.
  - `src/services/AudioService.ts` – Web Audio API SFX: `playClick`, `playFlip`, `playMatch`, `playMismatch`, `playPause`, `playWin`, `playNewGame`; toggle persisted in `localStorage` (`cs2memo:sfxEnabled`).
  - `src/services/SeedGenerator.ts` – seed hashing and RNG utilities: `hashSeed`, `createRng`, `createPairIds`, `seededShuffle`.

- **Stores (Pinia)**
  - `src/stores/gameDifficulty.ts` – difficulty selection and grid mapping (`rows` x `cols`), API: `setDifficultyFromGrid`, `difficultyInfo`.
  - `src/stores/gameHistory.ts` – game results history (moves, time, date, seed) with persistence.

- **Components**
  - `src/components/game/GameCanvas.vue` – main Canvas game component: grid layout (`utils/layout.ts`), flip animations, pointer input, win overlay, emits `hud-update`.
  - `src/components/game/DifficultySelector.vue` – difficulty selector UI (updates store).
  - `src/components/history/GameHistoryList.vue` – renders stored game history.

- **Views**
  - `src/views/Menu.vue` – start screen, difficulty selection, optional `seed`, navigation to Game/History.
  - `src/views/Game.vue` – hosts `GameCanvas.vue`, shows HUD (moves, time, pause, completion state).
  - `src/views/History.vue` – browse previous game results.

- **Utils**
  - `src/utils/layout.ts` – grid computation `computeGridLayout`, hit testing `hitTestTile`.
  - `src/utils/colors.ts` – color utilities for rendering.

- **Types & data**
  - `src/types/memory.ts` – `MemoryGameConfig` and `MemoryGamePublicState` definitions.
  - `src/types/canvas.ts`, `src/types/layout.ts`, `src/types/cs2.ts` – supporting types.
  - `src/data/cs2Catalog.ts` – CS2 catalog (`CS2_ITEMS`), `getItemById`.

### GameCanvas component API

- **Props**: `rows: number`, `cols: number`, `seed?: string | number`
- **Events**: `hud-update` with `{ moves, time, paused, completed }` for HUD updates in the view.

### URL parameters

- `/game` accepts optional query params: `seed`, `rows`, `cols`. Example: `/game?rows=4&cols=4&seed=cs2-2025`.

### localStorage keys

- `cs2memo:game` – current game data/history (via store).
- `cs2memo:sfxEnabled` – user preference for sound effects.

## Testing and quality

- Unit tests: `yarn test:unit`
- Linting: `yarn lint`
- Type checking: `yarn type-check`
