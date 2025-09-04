// Deterministic RNG and helpers for seeded shuffle

export type SeedInput = string | number | undefined | null

export function hashSeed(input: SeedInput): number {
    if (input == null) return 0x9e3779b1 >>> 0
    if (typeof input === 'number' && Number.isFinite(input)) return (input >>> 0) || 0x9e3779b1
    const str = String(input)
    let h = 2166136261 >>> 0
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

export function mulberry32(seed: number): () => number {
    let t = seed >>> 0
    return function () {
        t += 0x6d2b79f5
        let r = Math.imul(t ^ (t >>> 15), 1 | t)
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296
    }
}

export function createRng(seed: SeedInput): () => number {
    return mulberry32(hashSeed(seed))
}

export function seededShuffle<T>(array: T[], rng: () => number): T[] {
    const a = array.slice()
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
            ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

export function createPairIds(totalTiles: number, rng: () => number): number[] {
    const pairCount = Math.floor(totalTiles / 2)
    const ids: number[] = []
    for (let i = 0; i < pairCount; i++) ids.push(i, i)
    return seededShuffle(ids, rng)
}
