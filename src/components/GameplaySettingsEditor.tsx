import React from 'react';
import { Box, Paper, Typography, Switch, FormControlLabel, Slider } from '@mui/material';
import { NineKingsSettings, GameplaySettings } from '../types/settings';
import { parseSerializedValue, stringifySerializedValue } from '../utils/settingsHelper';

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
        游戏设置
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.ScreenShake}
              onChange={handleBooleanChange('ScreenShake')}
            />
          }
          label="屏幕震动"
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.SkipAnimations}
              onChange={handleBooleanChange('SkipAnimations')}
            />
          }
          label="跳过动画"
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.PlotDamageText}
              onChange={handleBooleanChange('PlotDamageText')}
            />
          }
          label="显示伤害文字"
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.DamageIndicators}
              onChange={handleBooleanChange('DamageIndicators')}
            />
          }
          label="伤害指示器"
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.AutoAttackEnabled}
              onChange={handleBooleanChange('AutoAttackEnabled')}
            />
          }
          label="自动攻击"
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.TroopAnimations}
              onChange={handleBooleanChange('TroopAnimations')}
            />
          }
          label="部队动画"
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.BloodEnabled}
              onChange={handleBooleanChange('BloodEnabled')}
            />
          }
          label="显示血液效果"
        />
        <FormControlLabel
          control={
            <Switch
              checked={gameplaySettings.EnableEnemySlowTime}
              onChange={handleBooleanChange('EnableEnemySlowTime')}
            />
          }
          label="敌人减速效果"
        />
        <Box>
          <Typography gutterBottom>游戏速度</Typography>
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