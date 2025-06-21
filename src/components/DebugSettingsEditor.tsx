import React from 'react';
import { Box, FormControlLabel, Switch, Typography, Paper } from '@mui/material';
import { getDefaultTranslation } from '../utils/translationHelper';

interface DebugSettingsEditorProps {
  settings: {
    DebugSettings: {
      Key: string;
      SerializedValue: string;
    };
  };
  onSettingsChange: (settings: any) => void;
}

const DebugSettingsEditor: React.FC<DebugSettingsEditorProps> = ({ settings, onSettingsChange }) => {
  const debugSettings = JSON.parse(settings.DebugSettings.SerializedValue);

  const handleChange = (key: keyof typeof debugSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDebugSettings = {
      ...debugSettings,
      [key]: event.target.checked,
    };

    onSettingsChange({
      ...settings,
      DebugSettings: {
        Key: "DebugSettings",
        SerializedValue: JSON.stringify(newDebugSettings),
      },
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {getDefaultTranslation('debug.title')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={debugSettings.ShowFPS}
              onChange={handleChange('ShowFPS')}
            />
          }
          label={getDefaultTranslation('debug.showFPS')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={debugSettings.DebugModeEnabled}
              onChange={handleChange('DebugModeEnabled')}
            />
          }
          label={getDefaultTranslation('debug.debugMode')}
        />
      </Box>
    </Paper>
  );
};

export default DebugSettingsEditor; 