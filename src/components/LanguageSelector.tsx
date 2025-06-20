import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  getCurrentLanguage,
  setCurrentLanguage,
  getSupportedLanguages,
  getLanguageLocalName,
} from '../utils/languageManager';

const LanguageSelector: React.FC = () => {
  const [currentLanguage, setLanguageState] = useState(getCurrentLanguage());

  useEffect(() => {
    // 监听语言变化事件
    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setLanguageState(customEvent.detail.language);
    };

    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    const newLanguage = event.target.value;
    setCurrentLanguage(newLanguage);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Language</InputLabel>
      <Select
        value={currentLanguage}
        label="Language"
        onChange={handleChange}
      >
        {Object.entries(getSupportedLanguages()).map(([code, name]) => (
          <MenuItem key={code} value={code}>
            {getLanguageLocalName(code)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector; 