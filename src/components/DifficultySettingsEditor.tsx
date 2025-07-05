import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { NineKingsSettings, DifficultySettings } from '../types/settings';
import { parseSerializedValue, stringifySerializedValue } from '../services/settingsService';
import { getDefaultTranslation, getDifficultyTranslation } from '../i18n/translationHelper';

interface DifficultySettingsEditorProps {
  settings: NineKingsSettings;
  onChange: (settings: NineKingsSettings) => void;
}

const DifficultySettingsEditor: React.FC<DifficultySettingsEditorProps> = ({ settings, onChange }) => {
  const difficultySettings = parseSerializedValue<DifficultySettings>(
    settings.DifficultySettings.SerializedValue
  );

  const handleDifficultyChange = (value: number) => {
    const newDifficultySettings = {
      ...difficultySettings,
      DifficultySelected: value,
    };

    onChange({
      ...settings,
      DifficultySettings: {
        ...settings.DifficultySettings,
        SerializedValue: stringifySerializedValue(newDifficultySettings),
      },
    });
  };

  const handleLevelChange = (levelKey: string, isEnabled: boolean) => {
    const newDifficultySettings = {
      ...difficultySettings,
      LevelSettings: {
        ...difficultySettings.LevelSettings,
        [levelKey]: {
          ...difficultySettings.LevelSettings[levelKey],
          IsEnabled: isEnabled,
        },
      },
    };

    onChange({
      ...settings,
      DifficultySettings: {
        ...settings.DifficultySettings,
        SerializedValue: stringifySerializedValue(newDifficultySettings),
      },
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {getDefaultTranslation('app.tabs.difficulty')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>{getDefaultTranslation('difficulty.currentDifficulty')}</InputLabel>
          <Select
            value={difficultySettings.DifficultySelected}
            onChange={(e: SelectChangeEvent<number>) =>
              handleDifficultyChange(e.target.value as number)
            }
            label={getDefaultTranslation('difficulty.currentDifficulty')}
          >
            {Object.entries(difficultySettings.LevelSettings)
              .filter(([_, level]) => level.IsEnabled)
              .map(([key], index) => (
                <MenuItem key={key} value={index}>
                  {getDifficultyTranslation(key)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {Object.entries(difficultySettings.LevelSettings).map(([key, level]) => (
            <FormControlLabel
              key={key}
              control={
                <Switch
                  checked={level.IsEnabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleLevelChange(key, e.target.checked)
                  }
                />
              }
              label={getDifficultyTranslation(key)}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default DifficultySettingsEditor; 