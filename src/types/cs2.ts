export enum CS2Rarity {
    ConsumerGrade = 'consumer',
    IndustrialGrade = 'industrial',
    MilSpec = 'milspec',
    Restricted = 'restricted',
    Classified = 'classified',
    Covert = 'covert',
    Knife = 'knife',
    Glove = 'glove',
}

export const ALL_CS2_RARITIES: CS2Rarity[] = [
    CS2Rarity.ConsumerGrade,
    CS2Rarity.IndustrialGrade,
    CS2Rarity.MilSpec,
    CS2Rarity.Restricted,
    CS2Rarity.Classified,
    CS2Rarity.Covert,
    CS2Rarity.Knife,
    CS2Rarity.Glove,
];

export type RarityString = `${CS2Rarity}`;

export type CS2ItemType = 'weapon' | 'knife' | 'glove' | 'grenade' | 'equipment';

export interface CS2Item {
    name: string;
    type: CS2ItemType;
    rarity: CS2Rarity;
    statTrak?: number | null;
    imageWebp?: string;
    imagePng?: string;
}


