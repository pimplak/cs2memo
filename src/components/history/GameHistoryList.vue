<template>
    <div class="game-history-list">
        <div class="controls">
            <div class="filters">
                <select v-model="selectedDifficulty" class="filter-select cs-input" style="width:auto;">
                    <option value="">All Difficulties</option>
                    <option v-for="difficulty in difficulties" :key="difficulty" :value="difficulty">
                        {{ formatDifficulty(difficulty) }}
                    </option>
                </select>

                <select v-model="sortField" class="filter-select cs-input" style="width:auto;">
                    <option value="completedAt">Date</option>
                    <option value="movesCount">Moves</option>
                    <option value="elapsedMs">Time</option>
                    <option value="difficulty">Difficulty</option>
                </select>

                <button @click="toggleSortDirection" class="cs-button" style="padding:0.5rem 0.75rem;">
                    <span class="button-accent"></span>
                    {{ sortDirection === 'desc' ? '↓' : '↑' }}
                </button>

                <button v-if="filteredGames.length > 0" @click="clearFilters" class="cs-button"
                    style="padding:0.5rem 0.75rem;">
                    <span class="button-accent"></span>
                    Clear
                </button>
            </div>

            <div class="actions"></div>
        </div>

        <div v-if="loading" class="loading">
            Loading history...
        </div>

        <div v-else-if="filteredGames.length === 0" class="empty-state">
            <div class="empty-icon">🎮</div>
            <h3>No games found</h3>
            <p>{{ hasAnyGames ? 'No games match your filters' : 'Start playing to build your history!' }}</p>
        </div>

        <div v-else class="games-grid">
            <div v-for="game in filteredGames" :key="game.id" class="game-card cs-card">
                <div class="game-header">
                    <div class="difficulty-badge" :class="`difficulty-${game.difficulty}`">
                        {{ formatDifficulty(game.difficulty) }}
                    </div>
                    <div class="date">
                        {{ formatDate(game.completedAt) }}
                    </div>
                </div>

                <div class="game-stats">
                    <div class="stat">
                        <span class="label">Moves:</span>
                        <span class="value">{{ game.movesCount }}</span>
                    </div>

                    <div class="stat">
                        <span class="label">Time:</span>
                        <span class="value">{{ formatTime(game.elapsedMs) }}</span>
                    </div>

                    <div v-if="game.seed" class="stat">
                        <span class="label">Seed:</span>
                        <span class="value seed">{{ formatSeed(game.seed) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="filteredGames.length > 0" class="summary">
            <p>
                Showing {{ filteredGames.length }} of {{ totalGames }} games
                {{ selectedDifficulty ? `(${formatDifficulty(selectedDifficulty)} only)` : '' }}
            </p>
        </div>
    </div>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameHistoryStore } from '@/stores/gameHistory'
import { GameDifficulty } from '@/types/memory'

const gameHistoryStore = useGameHistoryStore()

const loading = ref(false)
const selectedDifficulty = ref<GameDifficulty | ''>('')
const sortField = ref<'completedAt' | 'movesCount' | 'elapsedMs' | 'difficulty'>('completedAt')
const sortDirection = ref<'asc' | 'desc'>('desc')

const difficulties = Object.values(GameDifficulty)

const totalGames = computed(() => gameHistoryStore.gameHistory.length)
const hasAnyGames = computed(() => totalGames.value > 0)

const filteredGames = computed(() => {
    let games = [...gameHistoryStore.gameHistory]

    if (selectedDifficulty.value) {
        games = games.filter(g => g.difficulty === selectedDifficulty.value)
    }

    games.sort((a, b) => {
        let aVal: number = 0, bVal: number = 0
        switch (sortField.value) {
            case 'completedAt':
                aVal = a.completedAt.getTime()
                bVal = b.completedAt.getTime()
                break
            case 'movesCount':
                aVal = a.movesCount
                bVal = b.movesCount
                break
            case 'elapsedMs':
                aVal = a.elapsedMs
                bVal = b.elapsedMs
                break
            case 'difficulty':
                aVal = getDifficultyOrder(a.difficulty)
                bVal = getDifficultyOrder(b.difficulty)
                break
            default:
                return 0
        }
        if (sortDirection.value === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
        }
    })

    return games
})

function toggleSortDirection() {
    sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
}

function clearFilters() {
    selectedDifficulty.value = ''
    sortField.value = 'completedAt'
    sortDirection.value = 'desc'
}


function formatDifficulty(difficulty: GameDifficulty): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
}

function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes > 0) {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${remainingSeconds}s`
}

function formatSeed(seed: string | number): string {
    const str = seed.toString()
    return str.length > 10 ? `${str.slice(0, 10)}...` : str
}

function getDifficultyOrder(difficulty: GameDifficulty): number {
    switch (difficulty) {
        case GameDifficulty.Easy: return 1
        case GameDifficulty.Medium: return 2
        case GameDifficulty.Hard: return 3
        case GameDifficulty.Expert: return 4
        default: return 0
    }
}
</script>

<style scoped>
.game-history-list {
    width: 100%;
}

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
}

.filters {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.filter-select option {
    background: var(--cs-bg-2);
    color: var(--cs-text);
}

.actions {
    display: flex;
    gap: 0.5rem;
}

.export-button {
    padding: 0.5rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    background: rgba(0, 150, 0, 0.2);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
}

.export-button:hover {
    background: rgba(0, 150, 0, 0.3);
}

.loading {
    text-align: center;
    padding: 2rem;
    opacity: 0.7;
}

.empty-state {
    text-align: center;
    padding: 3rem 1rem;
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.empty-state h3 {
    margin-bottom: 0.5rem;
}

.empty-state p {
    opacity: 0.7;
}

.games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
}


.game-card {
    padding: 1rem;
    transition: all 0.2s ease;
}

.game-card:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
}

/* removed perfect-game styles */

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.difficulty-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
}

.difficulty-easy {
    background: rgba(0, 200, 0, 0.3);
}

.difficulty-medium {
    background: rgba(255, 165, 0, 0.3);
}

.difficulty-hard {
    background: rgba(255, 100, 0, 0.3);
}

.difficulty-expert {
    background: rgba(255, 0, 0, 0.3);
}

.date {
    font-size: 0.8rem;
    opacity: 0.7;
}

.game-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.label {
    font-size: 0.9rem;
    opacity: 0.8;
}

.value {
    font-weight: bold;
}

.perfect-badge {
    margin-left: 0.5rem;
}

.seed {
    font-family: monospace;
    font-size: 0.8rem;
}

/* removed rarity styles */

/* removed score/grade styles */

.summary {
    margin-top: 1.5rem;
    text-align: center;
    opacity: 0.7;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .controls {
        flex-direction: column;
        align-items: stretch;
    }

    .filters {
        justify-content: center;
    }

    .games-grid {
        grid-template-columns: 1fr;
    }
}
</style>
