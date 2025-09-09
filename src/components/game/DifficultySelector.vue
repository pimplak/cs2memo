<template>
    <div class="difficulty-selector">
        <div class="cs-title">
            <h3>Select Difficulty</h3>
            <span class="title-divider"></span>
        </div>
        <div class="difficulty-grid">
            <button v-for="difficulty in difficulties" :key="difficulty" @click="selectDifficulty(difficulty)"
                class="difficulty-button cs-card" :class="{
                    active: currentDifficulty === difficulty,
                    [`difficulty-${difficulty}`]: true
                }" :aria-pressed="currentDifficulty === difficulty"
                :title="currentDifficulty === difficulty ? 'Selected' : 'Select'">
                <span class="card-accent" />
                <span v-if="currentDifficulty === difficulty" class="selected-mark" aria-hidden="true">
                    <svg viewBox="0 0 24 24" class="selected-icon" aria-hidden="true">
                        <path d="M6 12l4 4 8-8" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <div class="card-top">
                    <span class="badge">
                        <svg viewBox="0 0 24 24" aria-hidden="true" class="badge-icon">
                            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none" />
                            <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="currentColor" stroke-width="2"
                                stroke-linecap="square" />
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                        </svg>
                    </span>
                    <span class="difficulty-name">{{ formatDifficulty(difficulty) }}</span>
                    <span class="difficulty-dots">{{ getDifficultyDots(difficulty) }}</span>
                </div>
                <div class="card-meta">
                    <span class="meta-label">GRID</span>
                    <span class="mono">{{ getDifficultyGridInfo(difficulty) }}</span>
                    <span class="dot" />
                    <span class="meta-label">TILES</span>
                    <span class="mono">{{ getDifficultyTileCount(difficulty) }}</span>
                </div>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameDifficultyStore } from '@/stores/gameDifficulty'
import { GameDifficulty } from '@/types/memory'
import { getGridFromDifficulty } from '@/types/memory'

const difficultyStore = useGameDifficultyStore()

const difficulties = Object.values(GameDifficulty)
const currentDifficulty = computed(() => difficultyStore.currentDifficulty)

function selectDifficulty(difficulty: GameDifficulty) {
    difficultyStore.setDifficulty(difficulty)
}

function formatDifficulty(difficulty: GameDifficulty): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

function getDifficultyDots(difficulty: GameDifficulty): string {
    const levels: Record<GameDifficulty, number> = {
        [GameDifficulty.Easy]: 1,
        [GameDifficulty.Medium]: 2,
        [GameDifficulty.Hard]: 3,
        [GameDifficulty.Expert]: 4
    }
    return '•'.repeat(levels[difficulty])
}

function getDifficultyGridInfo(difficulty: GameDifficulty): string {
    const grid = getGridFromDifficulty(difficulty)
    return `${grid.rows}×${grid.cols}`
}

function getDifficultyTileCount(difficulty: GameDifficulty): number {
    const grid = getGridFromDifficulty(difficulty)
    return grid.rows * grid.cols
}
</script>

<style scoped>
.difficulty-selector {
    width: 100%;
}

.cs-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
}

.cs-title h3 {
    margin: 0;
    font-size: 1.1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #e0e6ef;
}

.cs-title .title-divider {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(215, 184, 116, 0.8), rgba(215, 184, 116, 0.1));
}

.difficulty-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: stretch;
}

.difficulty-button {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 0 1 240px;
    max-width: 300px;
    gap: 0.6rem;
    padding: 0.9rem 1rem 0.9rem 1.1rem;
    background: #0d131a;
    color: #e6edf6;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    border: 1px solid #1b2431;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
    text-align: left;
}

.difficulty-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}

.difficulty-button.active {
    border-color: #d7b874;
    box-shadow: 0 0 0 1px rgba(215, 184, 116, 0.35), 0 10px 24px rgba(0, 0, 0, 0.35);
}

.difficulty-button.active .card-accent {
    animation: accentPulse 1.8s ease-in-out infinite;
}

.difficulty-button.active::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid rgba(215, 184, 116, 0.22);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
    pointer-events: none;
    animation: borderPulse 1.8s ease-in-out infinite;
}

.cs-card .card-accent {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, rgba(215, 184, 116, 0.7), rgba(215, 184, 116, 0.15));
}

.difficulty-easy .card-accent {
    background: linear-gradient(180deg, #6fcf97, rgba(111, 207, 151, 0.2));
}

.difficulty-medium .card-accent {
    background: linear-gradient(180deg, #d7b874, rgba(215, 184, 116, 0.2));
}

.difficulty-hard .card-accent {
    background: linear-gradient(180deg, #e06c75, rgba(224, 108, 117, 0.2));
}

.difficulty-expert .card-accent {
    background: linear-gradient(180deg, #d24d57, rgba(210, 77, 87, 0.2));
}

@keyframes accentPulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(215, 184, 116, 0.0);
        opacity: 0.85;
    }

    50% {
        box-shadow: 0 0 14px 0 rgba(215, 184, 116, 0.45);
        opacity: 1;
    }
}

@keyframes borderPulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(215, 184, 116, 0.0);
        opacity: 0.8;
    }

    50% {
        box-shadow: 0 0 18px 0 rgba(215, 184, 116, 0.25);
        opacity: 1;
    }
}

.card-top {
    display: flex;
    align-items: center;
    gap: 0.55rem;
}

.badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid #293244;
    border-radius: 4px;
    color: #d7b874;
    background: transparent;
}

.badge-icon {
    width: 16px;
    height: 16px;
}

.difficulty-name {
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.difficulty-dots {
    margin-left: auto;
    font-size: 0.8rem;
    color: rgba(215, 184, 116, 0.85);
    letter-spacing: 0.14em;
}

.card-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.meta-label {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    color: #8da2bd;
}

.mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.82rem;
    color: #dbe4f3;
}

.dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #3a465a;
    margin: 0 2px;
}

.selected-mark {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    background: rgba(215, 184, 116, 0.2);
    color: #d7b874;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.selected-icon {
    width: 14px;
    height: 14px;
}

.difficulty-button:focus-visible {
    outline: 2px solid rgba(215, 184, 116, 0.6);
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {

    .difficulty-button,
    .difficulty-button::after,
    .difficulty-button .card-accent {
        animation: none !important;
        transition: none !important;
    }
}

@media (max-width: 768px) {
    .difficulty-grid {
        justify-content: center;
    }

    .difficulty-button {
        padding: 0.9rem 1rem 0.9rem 1.1rem;
        flex: 0 1 240px;
    }

    .difficulty-name {
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .difficulty-grid {
        justify-content: center;
    }

    .difficulty-button {
        flex: 1 1 100%;
        max-width: 100%;
    }
}
</style>
