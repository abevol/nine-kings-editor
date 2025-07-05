interface PerkConfig {
  maxLevel: number;
  description?: string;  // 可以用来添加说明，解释为什么是这个限制
}

export const PERK_CONFIGS: { [key: string]: PerkConfig } = {
  'Perk_Expansionism': {
    maxLevel: 16,
    description: ''
  }
};

export const DEFAULT_MAX_LEVEL = Infinity;

export function getPerkMaxLevel(perkName: string): number {
  return PERK_CONFIGS[perkName]?.maxLevel ?? DEFAULT_MAX_LEVEL;
} 