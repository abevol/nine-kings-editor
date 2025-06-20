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
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NineKingsSettings, KingSettings } from '../types/settings';
import { parseSerializedValue, stringifySerializedValue } from '../utils/settingsHelper';
import {
  getDefaultTranslation,
  getKingTranslation,
  getPerkTranslation,
  getPerkDescriptionTranslation,
} from '../utils/translationHelper';

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
        {getDefaultTranslation('app.tabs.king')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(kingSettings).map(([kingKey, king]) => (
          <Accordion key={kingKey}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{getKingTranslation(kingKey)}</Typography>
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
                <TextField
                  label={getDefaultTranslation('king.totalXP')}
                  type="number"
                  value={king.TotalXP}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleKingChange(kingKey, 'TotalXP', parseInt(e.target.value))
                  }
                  fullWidth
                />
                <Typography variant="subtitle1" gutterBottom>
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
                        inputProps={{ min: 0, max: 3 }}
                        InputLabelProps={{
                          style: { fontSize: '1.2rem' }
                        }}
                      />
                    </Tooltip>
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