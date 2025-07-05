import React from 'react';
import { Box, Paper, Typography, Slider } from '@mui/material';
import { NineKingsSettings, AudioSettings } from '../types/settings';
import { parseSerializedValue, stringifySerializedValue } from '../services/settingsService';
import { getDefaultTranslation } from '../i18n/translationHelper';

interface AudioSettingsEditorProps {
  settings: NineKingsSettings;
  onChange: (settings: NineKingsSettings) => void;
}

const AudioSettingsEditor: React.FC<AudioSettingsEditorProps> = ({ settings, onChange }) => {
  const audioSettings = parseSerializedValue<AudioSettings>(settings.AudioSettings.SerializedValue);

  const handleChange = (key: keyof AudioSettings) => (_: Event, value: number | number[]) => {
    const newAudioSettings = {
      ...audioSettings,
      [key]: typeof value === 'number' ? value : value[0],
    };

    onChange({
      ...settings,
      AudioSettings: {
        ...settings.AudioSettings,
        SerializedValue: stringifySerializedValue(newAudioSettings),
      },
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {getDefaultTranslation('audio.title')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography gutterBottom>{getDefaultTranslation('audio.masterVolume')}</Typography>
          <Slider
            value={audioSettings.MasterVolume}
            onChange={handleChange('MasterVolume')}
            min={-80}
            max={0}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) => `${value} dB`}
          />
        </Box>
        <Box>
          <Typography gutterBottom>{getDefaultTranslation('audio.musicVolume')}</Typography>
          <Slider
            value={audioSettings.MusicVolume}
            onChange={handleChange('MusicVolume')}
            min={-80}
            max={0}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) => `${value} dB`}
          />
        </Box>
        <Box>
          <Typography gutterBottom>{getDefaultTranslation('audio.sfxVolume')}</Typography>
          <Slider
            value={audioSettings.SfxVolume}
            onChange={handleChange('SfxVolume')}
            min={-80}
            max={0}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) => `${value} dB`}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default AudioSettingsEditor; 