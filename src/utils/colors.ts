import { CS2Rarity } from '@/types/cs2';

const RARITY_BASE_COLORS: Record<CS2Rarity, string> = {
    [CS2Rarity.ConsumerGrade]: '#b0c3d9', // light blue/grey
    [CS2Rarity.IndustrialGrade]: '#5e98d9', // blue
    [CS2Rarity.MilSpec]: '#4b69ff', // strong blue
    [CS2Rarity.Restricted]: '#8847ff', // purple
    [CS2Rarity.Classified]: '#d32ce6', // pink/purple
    [CS2Rarity.Covert]: '#eb4b4b', // red
    [CS2Rarity.Knife]: '#ffd700', // golden accent
    [CS2Rarity.Glove]: '#9f7657', // brown/bronze accent
};

export function createRarityGradient(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    rarity: CS2Rarity
): CanvasGradient {
    const base = RARITY_BASE_COLORS[rarity];
    const grad = ctx.createLinearGradient(x, y, x, y + height);
    grad.addColorStop(0, withAlpha(darken(base, 0.1), 0.95));
    grad.addColorStop(0.5, withAlpha(base, 0.9));
    grad.addColorStop(1, withAlpha(lighten(base, 0.1), 0.95));
    return grad;
}

export function getRarityBaseColor(rarity: CS2Rarity): string {
    return RARITY_BASE_COLORS[rarity];
}

function clamp01(n: number): number {
    return n < 0 ? 0 : n > 1 ? 1 : n;
}

function lighten(hex: string, amount: number): string {
    return mix(hex, '#ffffff', clamp01(amount));
}

function darken(hex: string, amount: number): string {
    return mix(hex, '#000000', clamp01(amount));
}

function withAlpha(hex: string, alpha: number): string {
    const { r, g, b } = hexToRgb(hex);
    const a = clamp01(alpha);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const normalized = hex.replace('#', '');
    const bigint = parseInt(normalized, 16);
    if (normalized.length === 3) {
        // e.g. #abc -> #aabbcc
        const r = ((bigint >> 8) & 0xf) * 17;
        const g = ((bigint >> 4) & 0xf) * 17;
        const b = (bigint & 0xf) * 17;
        return { r, g, b };
    }
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function mix(hexA: string, hexB: string, t: number): string {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bch = Math.round(a.b + (b.b - a.b) * t);
    return rgbToHex(r, g, bch);
}

function rgbToHex(r: number, g: number, b: number): string {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(n: number): string {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
}


