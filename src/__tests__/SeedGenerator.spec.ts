import { describe, it, expect } from 'vitest'
import { hashSeed, mulberry32, createRng, seededShuffle, createPairIds } from '@/services/SeedGenerator'

describe('SeedGenerator', () => {
    it('hashSeed is deterministic and varies with input', () => {
        expect(hashSeed('abc')).toBe(hashSeed('abc'))
        expect(hashSeed('abc')).not.toBe(hashSeed('abd'))
        expect(hashSeed(42)).toBe(hashSeed(42))
        expect(hashSeed(undefined)).toBe(hashSeed(null))
    })

    it('mulberry32 generates same sequence for same seed and different for different seeds', () => {
        const a1 = mulberry32(123)
        const a2 = mulberry32(123)
        const b = mulberry32(456)

        const seqA1 = [a1(), a1(), a1(), a1(), a1()]
        const seqA2 = [a2(), a2(), a2(), a2(), a2()]
        const seqB = [b(), b(), b(), b(), b()]

        expect(seqA1).toEqual(seqA2)
        expect(seqA1).not.toEqual(seqB)
        expect(seqA1.every((n) => n >= 0 && n < 1)).toBe(true)
    })

    it('seededShuffle is deterministic and returns a permutation', () => {
        const rngA = createRng('fixed-seed')
        const rngB = createRng('fixed-seed')
        const input = Array.from({ length: 10 }, (_, i) => i + 1)

        const out1 = seededShuffle(input, rngA)
        const out2 = seededShuffle(input, rngB)

        expect(out1).toEqual(out2)
        expect(out1.sort((x, y) => x - y)).toEqual(input)
    })

    it('createPairIds creates pairs and shuffles deterministically', () => {
        const rng1 = createRng(999)
        const rng2 = createRng(999)
        const totalTiles = 16
        const ids1 = createPairIds(totalTiles, rng1)
        const ids2 = createPairIds(totalTiles, rng2)

        expect(ids1.length).toBe(totalTiles)
        expect(ids1).toEqual(ids2)

        const counts = new Map<number, number>()
        for (const id of ids1) counts.set(id, (counts.get(id) || 0) + 1)
        // should have totalTiles/2 distinct ids, each occurring twice
        expect(counts.size).toBe(totalTiles / 2)
        for (const c of counts.values()) expect(c).toBe(2)
    })
})


