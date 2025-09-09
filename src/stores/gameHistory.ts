import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { GameRecord } from '@/types/memory'

export const useGameHistoryStore = defineStore('gameHistory', () => {
    const STORAGE_KEY = 'cs2memo:history'

    const gameHistory = ref<GameRecord[]>([])

    function saveToStorage(): void {
        try {
            if (typeof window === 'undefined') return
            localStorage.setItem(STORAGE_KEY, JSON.stringify(gameHistory.value))
        } catch {
            // i
        }
    }

    function loadFromStorage(): void {
        try {
            if (typeof window === 'undefined') return

            const historyData = localStorage.getItem(STORAGE_KEY)
            if (historyData) {
                const parsed = JSON.parse(historyData) as GameRecord[]
                gameHistory.value = parsed.map(record => ({
                    ...record,
                    completedAt: new Date(record.completedAt)
                }))
            }
        } catch {
            gameHistory.value = []
        }
    }

    function addGameRecord(record: Omit<GameRecord, 'id' | 'completedAt'>): void {
        const gameRecord: GameRecord = {
            ...record,
            id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            completedAt: new Date()
        }

        gameHistory.value.push(gameRecord)
        saveToStorage()
    }

    function clearHistory(): void {
        gameHistory.value = []
        saveToStorage()
    }

    // removed export/import history API

    loadFromStorage()

    return {
        gameHistory: computed(() => gameHistory.value),
        addGameRecord,
        clearHistory,

    }
})
