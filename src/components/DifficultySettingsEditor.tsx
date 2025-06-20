import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { NineKingsSettings, DifficultySettings } from '../types/settings';
import { parseSerializedValue, stringifySerializedValue } from '../utils/settingsHelper';

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
        难度设置
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>当前难度</InputLabel>
          <Select
            value={difficultySettings.DifficultySelected}
            onChange={(e: SelectChangeEvent<number>) =>
              handleDifficultyChange(e.target.value as number)
            }
            label="当前难度"
          >
            {Object.entries(difficultySettings.LevelSettings)
              .filter(([_, level]) => level.IsEnabled)
              .map(([key], index) => (
                <MenuItem key={key} value={index}>
                  {key.replace('Difficulty_', '')}
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
              label={key.replace('Difficulty_', '')}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default DifficultySettingsEditor; 