import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NineKingsSettings, KingSettings } from '../types/settings';
import { parseSerializedValue, stringifySerializedValue } from '../utils/settingsHelper';

interface KingSettingsEditorProps {
  settings: NineKingsSettings;
  onChange: (settings: NineKingsSettings) => void;
}

const KingSettingsEditor: React.FC<KingSettingsEditorProps> = ({ settings, onChange }) => {
  const kingSettings = parseSerializedValue<{ [key: string]: KingSettings }>(
    settings.KingSettingsDictionary.SerializedValue
  );

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
    const newKingSettings = {
      ...kingSettings,
      [kingKey]: {
        ...kingSettings[kingKey],
        Perks: {
          ...kingSettings[kingKey].Perks,
          [perkName]: {
            ...kingSettings[kingKey].Perks[perkName],
            Level: level,
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

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        国王设置
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(kingSettings).map(([kingKey, king]) => (
          <Accordion key={kingKey}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{kingKey}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={king.IsEnabled}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleKingChange(kingKey, 'IsEnabled', e.target.checked)
                      }
                    />
                  }
                  label="已启用"
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
                  label="已获胜"
                />
                <TextField
                  label="总经验值"
                  type="number"
                  value={king.TotalXP}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleKingChange(kingKey, 'TotalXP', parseInt(e.target.value))
                  }
                  fullWidth
                />
                <Typography variant="subtitle1" gutterBottom>
                  天赋
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  {Object.entries(king.Perks).map(([perkName, perk]) => (
                    <TextField
                      key={perkName}
                      label={perkName.replace('Perk_', '')}
                      type="number"
                      value={perk.Level}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handlePerkChange(kingKey, perkName, parseInt(e.target.value))
                      }
                      fullWidth
                      inputProps={{ min: 0, max: 3 }}
                    />
                  ))}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
};

export default KingSettingsEditor; 