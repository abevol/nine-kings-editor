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
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  VolumeUp as AudioIcon,
  Settings as GameplayIcon,
  Person as KingIcon,
  Speed as DifficultyIcon,
  ContentCopy as CopyIcon,
  InsertDriveFile as FileIcon,
  Create as EditIcon,
  GetApp as DownloadIcon,
  Save as SaveIcon,
  PlayArrow as PlayIcon,
  BugReport as BugReportIcon,
  HelpOutline as HelpIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { NineKingsSettings } from './types/settings';
import { loadSettings, downloadSettings } from './utils/settingsHelper';
import { getDefaultTranslation } from './utils/translationHelper';
import AudioSettingsEditor from './components/AudioSettingsEditor';
import GameplaySettingsEditor from './components/GameplaySettingsEditor';
import KingSettingsEditor from './components/KingSettingsEditor';
import DifficultySettingsEditor from './components/DifficultySettingsEditor';
import LanguageSelector from './components/LanguageSelector';
import DebugSettingsEditor from './components/DebugSettingsEditor';

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

// 使用说明组件
const UsageInstructions: React.FC<{ copySuccess: boolean; handleCopyPath: () => Promise<void>; compact?: boolean }> = ({
  copySuccess,
  handleCopyPath,
  compact = false
}) => {
  return (
    <Stack spacing={compact ? 1 : 2} sx={{ width: '100%', alignItems: compact ? 'flex-start' : 'center' }}>
      <Box sx={{ 
        p: compact ? 1 : 2,
        borderRadius: 1,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100',
        width: compact ? '100%' : '80%'
      }}>
        <Stack spacing={compact ? 1 : 2}>
          {/* Step 1 */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" sx={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileIcon color="primary" fontSize="small" /> {getDefaultTranslation('app.prompt.step1')}
              </Typography>
              <Typography variant="body2" component="span" sx={{ 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200',
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

          {/* Step 2 */}
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CopyIcon color="primary" fontSize="small" /> {getDefaultTranslation('app.prompt.step2')}
          </Typography>

          {/* Step 3 */}
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon color="primary" fontSize="small" /> {getDefaultTranslation('app.prompt.step3')}
          </Typography>

          {/* Step 4 */}
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DownloadIcon color="primary" fontSize="small" /> {getDefaultTranslation('app.prompt.step4')}
          </Typography>

          {/* Step 5 */}
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
            <SaveIcon color="warning" fontSize="small" /> {getDefaultTranslation('app.prompt.step5')}
          </Typography>

          {/* Step 6 */}
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
            <PlayIcon color="success" fontSize="small" /> {getDefaultTranslation('app.prompt.step6')}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

function App() {
  const [settings, setSettings] = useState<NineKingsSettings | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // 监听语言变化事件，强制重新渲染
    const handleLanguageChange = () => {
      forceUpdate({});
      // 更新标题
      document.title = getDefaultTranslation('app.title');
    };

    // 初始化标题
    document.title = getDefaultTranslation('app.title');

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

  const handleHelpClick = () => {
    setHelpDialogOpen(true);
  };
  
  const handleCloseHelp = () => {
    setHelpDialogOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {getDefaultTranslation('app.title')}
            <Tooltip 
              title={getDefaultTranslation('app.help.tooltip')}
              placement="right"
            >
              <IconButton 
                color="inherit" 
                size="small" 
                sx={{ ml: 0.5 }}
                onClick={handleHelpClick}
              >
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
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
                <Tab icon={<BugReportIcon />} label={getDefaultTranslation('app.tabs.debug')} />
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
            <TabPanel value={currentTab} index={4}>
              <DebugSettingsEditor settings={settings} onSettingsChange={setSettings} />
            </TabPanel>
          </>
        ) : (
          <>
            <Typography variant="h5" align="center" sx={{ 
              mt: 8,
              mb: 4,
              fontWeight: 'medium'
            }}>
              {getDefaultTranslation('app.prompt.title')}
            </Typography>
            <UsageInstructions copySuccess={copySuccess} handleCopyPath={handleCopyPath} />
          </>
        )}
      </Container>
      <Dialog open={helpDialogOpen} onClose={handleCloseHelp} maxWidth={false}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {getDefaultTranslation('app.prompt.title')}
          <IconButton size="small" onClick={handleCloseHelp}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <UsageInstructions copySuccess={copySuccess} handleCopyPath={handleCopyPath} compact={true} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default App;
