export interface AudioSettings {
  MasterVolume: number;
  MusicVolume: number;
  SfxVolume: number;
  MusicSliderValue: number;
  SfxSliderValue: number;
}

export interface Achievement {
  id: number;
  isUnlocked: boolean;
  seenUnlocked: boolean;
}

export interface AchievementDictionary {
  [key: string]: Achievement;
}

export interface LocalizationSettings {
  Language: string;
}

export interface DebugSettings {
  ShowFPS: boolean;
  DebugModeEnabled: boolean;
}

export interface GameplaySettings {
  LastPlayedVersion: string;
  SeenEAScreen: boolean;
  SeenBeatKingDifficultyPanel: boolean;
  ScreenShake: boolean;
  SkipAnimations: boolean;
  PlotDamageText: boolean;
  DamageIndicators: boolean;
  AutoAttackEnabled: boolean;
  TroopAnimations: boolean;
  BloodEnabled: boolean;
  DisableEndlessRed: boolean;
  EnableEnemySlowTime: boolean;
  Speed: number;
}

export interface GameStatistics {
  LastPlayedKing: number;
  PlayedGames: number;
  WonGames: number;
  PerfectWonGames: number;
  UnitsKilled: number;
  CoinsSpent: number;
  LeveledUpPlots: number;
  BuildingsPlaced: number;
  TroopCardsUsed: number;
  TroopsTrained: number;
  SpellCardsUsed: number;
  GameCode: string;
}

export interface Perk {
  Name: string;
  Level: number;
}

export interface KingSettings {
  King: number;
  IsEnabled: boolean;
  HasVictory: boolean;
  IsDemoEnabled: boolean;
  SeenUnlockScreen: boolean;
  UpgradedFromLegacyXPSystem: boolean;
  TotalXP: number;
  UsedPerkPoints: number;
  NewUnlockedPerk: boolean;
  Perks: { [key: string]: Perk };
  DifficultiesWon: string[];
}

export interface TutorialSettings {
  HasPlayed: boolean;
  ForceTutorial: boolean;
  EnablePerksTutorial: boolean;
}

export interface DifficultyLevel {
  Name: string;
  IsEnabled: boolean;
}

export interface DifficultySettings {
  DifficultySelected: number;
  LevelSettings: { [key: string]: DifficultyLevel };
}

export interface NineKingsSettings {
  AudioSettings: {
    Key: string;
    SerializedValue: string;
  };
  AchievementSettingsDictionary: {
    Key: string;
    SerializedValue: string;
  };
  LocalizationSettings: {
    Key: string;
    SerializedValue: string;
  };
  DebugSettings: {
    Key: string;
    SerializedValue: string;
  };
  GameplaySettings: {
    Key: string;
    SerializedValue: string;
  };
  GameStatistics: {
    Key: string;
    SerializedValue: string;
  };
  GameplayStatistics: {
    Key: string;
    SerializedValue: string;
  };
  KingSettingsDictionary: {
    Key: string;
    SerializedValue: string;
  };
  TutorialSettings: {
    Key: string;
    SerializedValue: string;
  };
  DifficultySettings: {
    Key: string;
    SerializedValue: string;
  };
} 