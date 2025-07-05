import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { NineKingsSettings, KingSettings } from '../types/settings';
import { parseSerializedValue, stringifySerializedValue } from '../services/settingsService';
import {
  getDefaultTranslation,
  getKingTranslation,
  getPerkTranslation,
  getPerkDescriptionTranslation,
} from '../i18n/translationHelper';
import { getPerkMaxLevel } from '../config/perkConfig';

interface KingSettingsEditorProps {
  settings: NineKingsSettings;
  onChange: (settings: NineKingsSettings) => void;
}

const KingSettingsEditor: React.FC<KingSettingsEditorProps> = ({ settings, onChange }) => {
  const kingSettings = parseSerializedValue<{ [key: string]: KingSettings }>(
    settings.KingSettingsDictionary.SerializedValue
  );

  const [selectedKing, setSelectedKing] = useState<string>(Object.keys(kingSettings)[0]);

  // 添加动画样式
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(0.95);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.8;
        }
        100% {
          transform: scale(0.95);
          opacity: 0.5;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleKingChange = (kingKey: string, field: keyof KingSettings, value: any) => {
    const newKingSettings = {
      ...kingSettings,
      [kingKey]: {
        ...kingSettings[kingKey],
        [field]: value,
      },
    };

    onChange({
      ...settings,
      KingSettingsDictionary: {
        ...settings.KingSettingsDictionary,
        SerializedValue: stringifySerializedValue(newKingSettings),
      },
    });
  };

  const handlePerkChange = (kingKey: string, perkName: string, level: number) => {
    // Get max level from config
    const maxLevel = getPerkMaxLevel(perkName);

    // Ensure level is within bounds
    const boundedLevel = Math.max(0, Math.min(level, maxLevel));

    const newKingSettings = {
      ...kingSettings,
      [kingKey]: {
        ...kingSettings[kingKey],
        Perks: {
          ...kingSettings[kingKey].Perks,
          [perkName]: {
            ...kingSettings[kingKey].Perks[perkName],
            Level: boundedLevel,
          },
        },
      },
    };

    onChange({
      ...settings,
      KingSettingsDictionary: {
        ...settings.KingSettingsDictionary,
        SerializedValue: stringifySerializedValue(newKingSettings),
      },
    });
  };

  /**
   * 生成天赋等级输入框的属性配置
   * @param perkName 天赋名称
   */
  const getPerkInputProps = (perkName: string) => {
    const maxLevel = getPerkMaxLevel(perkName);
    return {
      min: 0,
      ...(maxLevel !== Infinity && { max: maxLevel })
    };
  };

  const renderKingContent = (kingKey: string, king: KingSettings) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {getKingTranslation(kingKey)}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={king.IsEnabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleKingChange(kingKey, 'IsEnabled', e.target.checked)
              }
            />
          }
          label={getDefaultTranslation('king.enabled')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={king.HasVictory}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleKingChange(kingKey, 'HasVictory', e.target.checked)
              }
            />
          }
          label={getDefaultTranslation('king.hasVictory')}
        />
        <Tooltip title={getDefaultTranslation('king.legacyXP.tooltip')}>
          <FormControlLabel
            control={
              <Switch
                checked={king.UpgradedFromLegacyXPSystem}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleKingChange(kingKey, 'UpgradedFromLegacyXPSystem', e.target.checked)
                }
              />
            }
            label={getDefaultTranslation('king.legacyXP')}
          />
        </Tooltip>
        <Tooltip title={getDefaultTranslation('king.newUnlockedPerk.tooltip')}>
          <FormControlLabel
            control={
              <Switch
                checked={king.NewUnlockedPerk}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleKingChange(kingKey, 'NewUnlockedPerk', e.target.checked)
                }
                color="warning"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  color={king.NewUnlockedPerk ? 'warning.main' : 'text.primary'}
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    '&::after': king.NewUnlockedPerk ? {
                      content: '""',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'warning.main',
                      marginLeft: '8px',
                      animation: 'pulse 1.5s infinite'
                    } : {}
                  }}
                >
                  {getDefaultTranslation('king.newUnlockedPerk')}
                </Typography>
              </Box>
            }
          />
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label={getDefaultTranslation('king.totalXP')}
          type="number"
          value={king.TotalXP}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleKingChange(kingKey, 'TotalXP', parseInt(e.target.value))
          }
          sx={{ flex: 1 }}
        />
        <TextField
          label={getDefaultTranslation('king.unlockedPerks')}
          type="number"
          value={king.UnlockedPerksCount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleKingChange(kingKey, 'UnlockedPerksCount', parseInt(e.target.value))
          }
          sx={{ flex: 1 }}
          slotProps={{ input: { inputProps: { min: 0 } } }}
        />
      </Box>
      <Typography variant="h6" gutterBottom>
        {getDefaultTranslation('king.perks')}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        {Object.entries(king.Perks).map(([perkName, perk]) => (
          <Tooltip
            key={perkName}
            title={
              <Typography style={{ fontSize: '1.0rem', whiteSpace: 'pre-wrap' }}>
                {getPerkDescriptionTranslation(perkName)}
              </Typography>
            }
            placement="top"
            arrow
          >
            <TextField
              label={getPerkTranslation(perkName)}
              type="number"
              value={perk.Level}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handlePerkChange(kingKey, perkName, parseInt(e.target.value))
              }
              fullWidth
              inputProps={getPerkInputProps(perkName)}
              InputLabelProps={{
                style: { fontSize: '1.2rem' }
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {getDefaultTranslation('app.tabs.king')}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, minHeight: 400 }}>
        <Paper elevation={2} sx={{ width: 200 }}>
          <List component="nav">
            {Object.entries(kingSettings).map(([kingKey]) => (
              <ListItem key={kingKey} disablePadding>
                <ListItemButton
                  selected={selectedKing === kingKey}
                  onClick={() => setSelectedKing(kingKey)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemText 
                    primary={getKingTranslation(kingKey)} 
                    sx={{ 
                      textAlign: 'center',
                      '& .MuiListItemText-primary': {
                        textAlign: 'center'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
        {selectedKing && renderKingContent(selectedKing, kingSettings[selectedKing])}
      </Box>
    </Paper>
  );
};

export default KingSettingsEditor; 