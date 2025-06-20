import React, { useState } from 'react';
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
} from '@mui/material';
import {
  VolumeUp as AudioIcon,
  Settings as GameplayIcon,
  Person as KingIcon,
  Speed as DifficultyIcon,
} from '@mui/icons-material';
import { NineKingsSettings } from './types/settings';
import { loadSettings, downloadSettings } from './utils/settingsHelper';
import AudioSettingsEditor from './components/AudioSettingsEditor';
import GameplaySettingsEditor from './components/GameplaySettingsEditor';
import KingSettingsEditor from './components/KingSettingsEditor';
import DifficultySettingsEditor from './components/DifficultySettingsEditor';

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const loadedSettings = await loadSettings(file);
      setSettings(loadedSettings);
    }
  };

  const handleSave = () => {
    if (settings) {
      downloadSettings(settings, '9KingsSettings.json');
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            九王编辑器
          </Typography>
          <Button color="inherit" component="label">
            打开配置
            <input type="file" hidden accept=".json" onChange={handleFileUpload} />
          </Button>
          <Button color="inherit" onClick={handleSave} disabled={!settings}>
            保存配置
          </Button>
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
                <Tab icon={<AudioIcon />} label="音频" />
                <Tab icon={<GameplayIcon />} label="游戏" />
                <Tab icon={<KingIcon />} label="国王" />
                <Tab icon={<DifficultyIcon />} label="难度" />
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
          <Typography variant="h5" align="center" sx={{ mt: 8 }}>
            请打开一个9Kings配置文件开始编辑
          </Typography>
        )}
      </Container>
    </Box>
  );
}

export default App;
