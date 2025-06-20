import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  VolumeUp as AudioIcon,
  Settings as GameplayIcon,
  Person as KingIcon,
  Speed as DifficultyIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { NineKingsSettings } from './types/settings';
import { loadSettings, downloadSettings } from './utils/settingsHelper';
import { getDefaultTranslation } from './utils/translationHelper';
import AudioSettingsEditor from './components/AudioSettingsEditor';
import GameplaySettingsEditor from './components/GameplaySettingsEditor';
import KingSettingsEditor from './components/KingSettingsEditor';
import DifficultySettingsEditor from './components/DifficultySettingsEditor';
import LanguageSelector from './components/LanguageSelector';

const getDefaultConfigPath = () => {
  const userProfile = process.env.USERPROFILE || '';
  return `${userProfile}\\AppData\\LocalLow\\SadSocket\\9Kings\\9KingsSettings.json`;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [settings, setSettings] = useState<NineKingsSettings | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // 监听语言变化事件，强制重新渲染
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  const handleFileClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const loadedSettings = await loadSettings(file);
        setSettings(loadedSettings);
      }
    };

    // 设置默认文件路径
    try {
      input.webkitdirectory = false;
      const defaultPath = getDefaultConfigPath();
      if (defaultPath) {
        input.setAttribute('nwworkingdir', defaultPath);
      }
    } catch (error) {
      console.warn('Failed to set default path:', error);
    }

    input.click();
  };

  const handleSave = () => {
    if (settings) {
      downloadSettings(settings, '9KingsSettings.json');
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCopyPath = async () => {
    const path = '%USERPROFILE%\\AppData\\LocalLow\\SadSocket\\9Kings\\9KingsSettings.json';
    try {
      await navigator.clipboard.writeText(path);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy path:', err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getDefaultTranslation('app.title')}
          </Typography>
          <Button color="inherit" onClick={handleFileClick}>
            {getDefaultTranslation('app.buttons.openConfig')}
          </Button>
          <Button color="inherit" onClick={handleSave} disabled={!settings}>
            {getDefaultTranslation('app.buttons.downloadConfig')}
          </Button>
          <Box sx={{ width: 16 }} />
          <LanguageSelector />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        {settings ? (
          <>
            <Paper sx={{ mt: 2 }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab icon={<AudioIcon />} label={getDefaultTranslation('app.tabs.audio')} />
                <Tab icon={<GameplayIcon />} label={getDefaultTranslation('app.tabs.gameplay')} />
                <Tab icon={<KingIcon />} label={getDefaultTranslation('app.tabs.king')} />
                <Tab icon={<DifficultyIcon />} label={getDefaultTranslation('app.tabs.difficulty')} />
              </Tabs>
            </Paper>
            <TabPanel value={currentTab} index={0}>
              <AudioSettingsEditor
                settings={settings}
                onChange={setSettings}
              />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <GameplaySettingsEditor
                settings={settings}
                onChange={setSettings}
              />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              <KingSettingsEditor
                settings={settings}
                onChange={setSettings}
              />
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
              <DifficultySettingsEditor
                settings={settings}
                onChange={setSettings}
              />
            </TabPanel>
          </>
        ) : (
          <Box>
            <Typography variant="h5" align="center" sx={{ 
              mt: 8,
              mb: 4,
              fontWeight: 'medium'
            }}>
              {getDefaultTranslation('app.prompt.openFile')}
            </Typography>
            <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
              <Box sx={{ 
                p: 2,
                borderRadius: 1,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100',
                width: '80%'
              }}>
                <Typography variant="body1" align="center" color="text.secondary">
                  {getDefaultTranslation('app.prompt.filePath')} `C:\Users\Your Username\AppData\LocalLow\SadSocket\9Kings\9KingsSettings.json`
                </Typography>
              </Box>

              <Box sx={{ 
                p: 2,
                borderRadius: 1,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
                width: '80%'
              }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'black' }}>
                    {getDefaultTranslation('app.prompt.inputPath')}
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ 
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'primary.main' : 'primary.main',
                    color: 'black',
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontWeight: 'medium'
                  }}>
                    %USERPROFILE%\AppData\LocalLow\SadSocket\9Kings\9KingsSettings.json
                  </Typography>
                  <Tooltip title={copySuccess ? getDefaultTranslation('app.prompt.copied') : getDefaultTranslation('app.prompt.copyPath')}>
                    <IconButton 
                      onClick={handleCopyPath} 
                      size="small" 
                      color={copySuccess ? "success" : "primary"}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Box sx={{ 
                p: 2,
                borderRadius: 1,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'warning.dark' : 'warning.light',
                width: '80%'
              }}>
                <Typography 
                  variant="body2" 
                  align="center" 
                  sx={{ color: 'black' }}
                >
                  {getDefaultTranslation('app.prompt.warning')}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
