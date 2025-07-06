import React from 'react';
import {
  VolumeUp as AudioIcon,
  Settings as GameplayIcon,
  Person as KingIcon,
  Speed as DifficultyIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';
import { NineKingsSettings } from '../types/settings';
import AudioSettingsEditor from '../components/AudioSettingsEditor';
import GameplaySettingsEditor from '../components/GameplaySettingsEditor';
import KingSettingsEditor from '../components/KingSettingsEditor';
import DifficultySettingsEditor from '../components/DifficultySettingsEditor';
import DebugSettingsEditor from '../components/DebugSettingsEditor';

export interface TabConfig {
  key: keyof NineKingsSettings;
  icon: React.ReactElement;
  label: string;
  component: React.ComponentType<any>;
  props?: Record<string, unknown>;
}

export const createTabConfigs = (setSettings: React.Dispatch<React.SetStateAction<NineKingsSettings | null>>): TabConfig[] => [
  {
    key: 'AudioSettings',
    icon: <AudioIcon />,
    label: 'app.tabs.audio',
    component: AudioSettingsEditor
  },
  {
    key: 'GameplaySettings',
    icon: <GameplayIcon />,
    label: 'app.tabs.gameplay',
    component: GameplaySettingsEditor
  },
  {
    key: 'KingSettingsDictionary',
    icon: <KingIcon />,
    label: 'app.tabs.king',
    component: KingSettingsEditor
  },
  {
    key: 'DifficultySettings',
    icon: <DifficultyIcon />,
    label: 'app.tabs.difficulty',
    component: DifficultySettingsEditor
  },
  {
    key: 'DebugSettings',
    icon: <BugReportIcon />,
    label: 'app.tabs.debug',
    component: DebugSettingsEditor,
    props: { onSettingsChange: setSettings }
  }
]; 