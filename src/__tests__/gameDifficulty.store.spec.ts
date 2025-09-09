import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameDifficultyStore } from '@/stores/gameDifficulty'
import { GameDifficulty } from '@/types/memory'

describe('useGameDifficultyStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('defaults to Medium with correct grid', () => {
        const store = useGameDifficultyStore()
        expect(store.currentDifficulty).toBe(GameDifficulty.Medium)
        expect(store.gridDimensions).toEqual({ rows: 4, cols: 4 })
        expect(store.difficultyInfo).toMatchObject({ pairs: 8, totalTiles: 16 })
    })

    it('setDifficulty updates currentDifficulty and derived values', () => {
        const store = useGameDifficultyStore()
        store.setDifficulty(GameDifficulty.Hard)
        expect(store.currentDifficulty).toBe(GameDifficulty.Hard)
        expect(store.gridDimensions).toEqual({ rows: 6, cols: 4 })
        expect(store.difficultyInfo.pairs).toBe(12)
    })

    it('setDifficultyFromGrid matches known presets', () => {
        const store = useGameDifficultyStore()

        store.setDifficultyFromGrid(4, 3)
        expect(store.currentDifficulty).toBe(GameDifficulty.Easy)

        store.setDifficultyFromGrid(4, 4)
        expect(store.currentDifficulty).toBe(GameDifficulty.Medium)

        store.setDifficultyFromGrid(6, 4)
        expect(store.currentDifficulty).toBe(GameDifficulty.Hard)

        store.setDifficultyFromGrid(6, 6)
        expect(store.currentDifficulty).toBe(GameDifficulty.Expert)
    })

    it('setDifficultyFromGrid uses fallbacks by totalTiles when not exact preset', () => {
        const store = useGameDifficultyStore()
        store.setDifficultyFromGrid(3, 4) // 12
        expect(store.currentDifficulty).toBe(GameDifficulty.Easy)

        store.setDifficultyFromGrid(4, 4) // 16
        expect(store.currentDifficulty).toBe(GameDifficulty.Medium)

        store.setDifficultyFromGrid(3, 8) // 24
        expect(store.currentDifficulty).toBe(GameDifficulty.Hard)

        store.setDifficultyFromGrid(5, 6) // 30
        expect(store.currentDifficulty).toBe(GameDifficulty.Expert)
    })
})


