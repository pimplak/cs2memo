import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { GameDifficulty } from '@/types/memory'
import { getGridFromDifficulty } from '@/types/memory'

export const useGameDifficultyStore = defineStore('gameDifficulty', () => {
    const currentDifficulty = ref<GameDifficulty>(GameDifficulty.Medium)

    const gridDimensions = computed(() => {
        return getGridFromDifficulty(currentDifficulty.value)
    })

    const difficultyInfo = computed(() => {
        const grid = gridDimensions.value
        const totalTiles = grid.rows * grid.cols

        return {
            difficulty: currentDifficulty.value,
            rows: grid.rows,
            cols: grid.cols,
            totalTiles,
            pairs: totalTiles / 2
        }
    })

    function setDifficulty(difficulty: GameDifficulty) {
        currentDifficulty.value = difficulty
    }

    // /game?rows=8&cols=8&seed=custom
    function setDifficultyFromGrid(rows: number, cols: number) {
        const totalTiles = rows * cols

        if (rows === 4 && cols === 3) {
            currentDifficulty.value = GameDifficulty.Easy
        } else if (rows === 4 && cols === 4) {
            currentDifficulty.value = GameDifficulty.Medium
        } else if (rows === 6 && cols === 4) {
            currentDifficulty.value = GameDifficulty.Hard
        } else if (rows === 6 && cols === 6) {
            currentDifficulty.value = GameDifficulty.Expert
        } else if (totalTiles <= 12) {
            currentDifficulty.value = GameDifficulty.Easy
        } else if (totalTiles <= 16) {
            currentDifficulty.value = GameDifficulty.Medium
        } else if (totalTiles <= 24) {
            currentDifficulty.value = GameDifficulty.Hard
        } else {
            currentDifficulty.value = GameDifficulty.Expert
        }
    }

    return {
        currentDifficulty: computed(() => currentDifficulty.value),
        gridDimensions,
        difficultyInfo,
        setDifficulty,
        setDifficultyFromGrid
    }
})
