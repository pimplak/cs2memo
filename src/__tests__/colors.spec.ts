import { describe, it, expect } from 'vitest'
import { getRarityBaseColor } from '@/utils/colors'
import { CS2Rarity } from '@/types/cs2'

describe('colors.getRarityBaseColor', () => {
    it('returns expected hex for each rarity', () => {
        expect(getRarityBaseColor(CS2Rarity.ConsumerGrade)).toBe('#b0c3d9')
        expect(getRarityBaseColor(CS2Rarity.IndustrialGrade)).toBe('#5e98d9')
        expect(getRarityBaseColor(CS2Rarity.MilSpec)).toBe('#4b69ff')
        expect(getRarityBaseColor(CS2Rarity.Restricted)).toBe('#8847ff')
        expect(getRarityBaseColor(CS2Rarity.Classified)).toBe('#d32ce6')
        expect(getRarityBaseColor(CS2Rarity.Covert)).toBe('#eb4b4b')
        expect(getRarityBaseColor(CS2Rarity.Knife)).toBe('#ffd700')
        expect(getRarityBaseColor(CS2Rarity.Glove)).toBe('#9f7657')
    })
})


