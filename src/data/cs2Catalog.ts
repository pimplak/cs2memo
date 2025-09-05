import { CS2Rarity, type CS2Item, type CS2ItemType } from '@/types/cs2';

const I = (id: string, name: string, type: CS2ItemType, rarity: CS2Rarity, webp?: string, png?: string, statTrak?: number | null): CS2Item => ({
    id,
    name,
    type,
    rarity,
    imageWebp: webp,
    imagePng: png,
    statTrak: statTrak ?? null,
});

export const CS2_ITEMS: CS2Item[] = [
    I('ak-47-redline', 'AK-47 | Redline', 'weapon', CS2Rarity.Covert, '/assets/ak_redline.webp', '/assets/ak_redline.png', 1234),
    I('m4a1-s-printstream', 'M4A1-S | Printstream', 'weapon', CS2Rarity.Covert, '/assets/m4a1s_printstream.webp', '/assets/m4a1s_printstream.png', 278),
    I('awp-asiimov', 'AWP | Asiimov', 'weapon', CS2Rarity.Covert, '/assets/awp_asiimov.webp', '/assets/awp_asiimov.png'),
    I('glock-18-water-elemental', 'Glock-18 | Water Elemental', 'weapon', CS2Rarity.Classified, '/assets/glock_water_elemental.webp', '/assets/glock_water_elemental.png'),
    I('usp-s-kill-confirmed', 'USP-S | Kill Confirmed', 'weapon', CS2Rarity.Classified, '/assets/usps_kill_confirmed.webp', '/assets/usps_kill_confirmed.png'),
    I('knife-karambit', 'Karambit', 'knife', CS2Rarity.Knife, '/assets/knife_karambit.webp', '/assets/knife_karambit.png'),
    I('knife-bayonet', 'Bayonet', 'knife', CS2Rarity.Knife, '/assets/knife_bayonet.webp', '/assets/knife_bayonet.png'),
    I('glove-sport', 'Sport Gloves', 'glove', CS2Rarity.Glove, '/assets/glove_sport.webp', '/assets/glove_sport.png'),
    I('glove-specialist', 'Specialist Gloves', 'glove', CS2Rarity.Glove, '/assets/glove_specialist.webp', '/assets/glove_specialist.png'),
    I('p250-sand-dune', 'P250 | Sand Dune', 'weapon', CS2Rarity.ConsumerGrade, '/assets/p250_sand_dune.webp', '/assets/p250_sand_dune.png'),
    I('mp7-armor-core', 'MP7 | Armor Core', 'weapon', CS2Rarity.IndustrialGrade, '/assets/mp7_armor_core.webp', '/assets/mp7_armor_core.png'),
    I('famas-valence', 'FAMAS | Valence', 'weapon', CS2Rarity.MilSpec, '/assets/famas_valence.webp', '/assets/famas_valence.png'),
    I('galil-eco', 'Galil AR | Eco', 'weapon', CS2Rarity.Restricted, '/assets/galil_eco.webp', '/assets/galil_eco.png'),
    I('ak-47-vulcan', 'AK-47 | Vulcan', 'weapon', CS2Rarity.Covert, '/assets/ak_vulcan.webp', '/assets/ak_vulcan.png'),
    I('m4a4-howl', 'M4A4 | Howl', 'weapon', CS2Rarity.Covert, '/assets/m4a4_howl.webp', '/assets/m4a4_howl.png'),
    I('deagle-blaze', 'Desert Eagle | Blaze', 'weapon', CS2Rarity.Classified, '/assets/deagle_blaze.webp', '/assets/deagle_blaze.png'),
    I('p90-emerald-dragon', 'P90 | Emerald Dragon', 'weapon', CS2Rarity.Classified, '/assets/p90_emerald_dragon.webp', '/assets/p90_emerald_dragon.png'),
    I('mp9-stained-glass', 'MP9 | Stained Glass', 'weapon', CS2Rarity.Restricted, '/assets/mp9_stained_glass.webp', '/assets/mp9_stained_glass.png'),
    I('sg553-pulse', 'SG 553 | Pulse', 'weapon', CS2Rarity.Restricted, '/assets/sg553_pulse.webp', '/assets/sg553_pulse.png'),
    I('tec-9-blue-titanium', 'Tec-9 | Blue Titanium', 'weapon', CS2Rarity.MilSpec, '/assets/tec9_blue_titanium.webp', '/assets/tec9_blue_titanium.png'),
    I('five-seven-forest-night', 'Five-SeveN | Forest Night', 'weapon', CS2Rarity.IndustrialGrade, '/assets/fiveseven_forest_night.webp', '/assets/fiveseven_forest_night.png'),
    I('nova-sand-dune', 'Nova | Sand Dune', 'weapon', CS2Rarity.ConsumerGrade, '/assets/nova_sand_dune.webp', '/assets/nova_sand_dune.png'),
    I('negev-desert-strike', 'Negev | Desert Strike', 'weapon', CS2Rarity.MilSpec, '/assets/negev_desert_strike.webp', '/assets/negev_desert_strike.png'),
    I('awm-safari-mesh', 'AWP | Safari Mesh', 'weapon', CS2Rarity.MilSpec, '/assets/awp_safari_mesh.webp', '/assets/awp_safari_mesh.png'),
    I('mac-10-heat', 'MAC-10 | Heat', 'weapon', CS2Rarity.Restricted, '/assets/mac10_heat.webp', '/assets/mac10_heat.png'),
    I('ump-45-primal-saber', 'UMP-45 | Primal Saber', 'weapon', CS2Rarity.Classified, '/assets/ump45_primal_saber.webp', '/assets/ump45_primal_saber.png'),
    I('cz75-auto-yellow-jacket', 'CZ75-Auto | Yellow Jacket', 'weapon', CS2Rarity.Classified, '/assets/cz75_yellow_jacket.webp', '/assets/cz75_yellow_jacket.png'),
    I('knife-butterfly', 'Butterfly Knife', 'knife', CS2Rarity.Knife, '/assets/knife_butterfly.webp', '/assets/knife_butterfly.png'),
    I('knife-shadow-daggers', 'Shadow Daggers', 'knife', CS2Rarity.Knife, '/assets/knife_shadow_daggers.webp', '/assets/knife_shadow_daggers.png'),
    I('glove-hand-wraps', 'Hand Wraps', 'glove', CS2Rarity.Glove, '/assets/glove_hand_wraps.webp', '/assets/glove_hand_wraps.png'),
    I('glove-driver', 'Driver Gloves', 'glove', CS2Rarity.Glove, '/assets/glove_driver.webp', '/assets/glove_driver.png'),
    I('smoke-grenade', 'Smoke Grenade', 'grenade', CS2Rarity.ConsumerGrade, '/assets/smoke_grenade.webp', '/assets/smoke_grenade.png'),
    I('flashbang', 'Flashbang', 'grenade', CS2Rarity.ConsumerGrade, '/assets/flashbang.webp', '/assets/flashbang.png'),
    I('kevlar-vest', 'Kevlar Vest', 'equipment', CS2Rarity.IndustrialGrade, '/assets/kevlar_vest.webp', '/assets/kevlar_vest.png'),
    I('defuse-kit', 'Defuse Kit', 'equipment', CS2Rarity.MilSpec, '/assets/defuse_kit.webp', '/assets/defuse_kit.png'),
];

export function getItemById(id: string): CS2Item | undefined {
    return CS2_ITEMS.find((i) => i.id === id);
}

export function getItemsByRarity(rarity: CS2Rarity): CS2Item[] {
    return CS2_ITEMS.filter((i) => i.rarity === rarity);
}

export function getItemsByType(type: CS2ItemType): CS2Item[] {
    return CS2_ITEMS.filter((i) => i.type === type);
}


