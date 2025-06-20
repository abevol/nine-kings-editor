import React from 'react';
import { Box, Paper, Typography, Switch, FormControlLabel, Slider } from '@mui/material';
import { NineKingsSettings, GameplaySettings } from '../types/settings';
import { parseSerializedValue, stringifySerializedValue } from '../utils/settingsHelper';
import { getDefaultTranslation } from '../utils/translationHelper';

interface GameplaySettingsEditorProps {
  settings: NineKingsSettings;
  onChange: (settings: NineKingsSettings) => void;
}

const GameplaySettingsEditor: React.FC<GameplaySettingsEditorProps> = ({ settings, onChange }) => {
  const gameplaySettings = parseSerializedValue<GameplaySettings>(settings.GameplaySettings.SerializedValue);

  const handleBooleanChange = (key: keyof GameplaySettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newGameplaySettings = {
      ...gameplaySettings,
      [key]: event.target.checked,
    };

    onChange({
      ...settings,
      GameplaySettings: {
        ...settings.GameplaySettings,
        SerializedValue: stringifySerializedValue(newGameplaySettings),
      },
    });
  };

  const handleSpeedChange = (_: Event, value: number | number[]) => {
    const newGameplaySettings = {
      ...gameplaySettings,
      Speed: typeof value === 'number' ? value : value[0],
    };

    onChange({
      ...settings,
      GameplaySettings: {
        ...settings.GameplaySettings,
        SerializedValue: stringifySerializedValue(newGameplaySettings),
      },
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {getDefaultTranslation('gameplay.title')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.ScreenShake}
              onChange={handleBooleanChange('ScreenShake')}
            />
          }
          label={getDefaultTranslation('gameplay.screenShake')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.SkipAnimations}
              onChange={handleBooleanChange('SkipAnimations')}
            />
          }
          label={getDefaultTranslation('gameplay.skipAnimations')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.PlotDamageText}
              onChange={handleBooleanChange('PlotDamageText')}
            />
          }
          label={getDefaultTranslation('gameplay.plotDamageText')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.DamageIndicators}
              onChange={handleBooleanChange('DamageIndicators')}
            />
          }
          label={getDefaultTranslation('gameplay.damageIndicators')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.AutoAttackEnabled}
              onChange={handleBooleanChange('AutoAttackEnabled')}
            />
          }
          label={getDefaultTranslation('gameplay.autoAttack')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.TroopAnimations}
              onChange={handleBooleanChange('TroopAnimations')}
            />
          }
          label={getDefaultTranslation('gameplay.troopAnimations')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.BloodEnabled}
              onChange={handleBooleanChange('BloodEnabled')}
            />
          }
          label={getDefaultTranslation('gameplay.bloodEnabled')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.EnableEnemySlowTime}
              onChange={handleBooleanChange('EnableEnemySlowTime')}
            />
          }
          label={getDefaultTranslation('gameplay.enemySlowTime')}
        />
        <Box>
          <Typography gutterBottom>{getDefaultTranslation('gameplay.gameSpeed')}</Typography>
          <Slider
            value={gameplaySettings.Speed}
            onChange={handleSpeedChange}
            min={1}
            max={3}
            step={0.5}
            marks
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default GameplaySettingsEditor; 