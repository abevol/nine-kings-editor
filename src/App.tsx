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
  Chip,
  Menu,
  MenuItem,
  ButtonGroup,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  InsertDriveFile as FileIcon,
  Create as EditIcon,
  GetApp as DownloadIcon,
  Save as SaveIcon,
  PlayArrow as PlayIcon,
  HelpOutline as HelpIcon,
  Close as CloseIcon,
  CheckCircleOutline as CompatibleIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import { NineKingsSettings } from './types/settings';
import { loadSettings, downloadSettings } from './services/settingsService';
import { getDefaultTranslation } from './i18n/translationHelper';
import { appConfig } from './config/appConfig';
import { createTabConfigs } from './config/tabConfig';
import LanguageSelector from './components/LanguageSelector';

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
                {appConfig.paths.defaultSavePath}
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
  const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] = useState<null | HTMLElement>(null);

  // 获取可用的标签页
  const availableTabs = settings
    ? createTabConfigs(setSettings).filter(tab => settings[tab.key] !== undefined)
    : [];

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
        setCurrentTab(0); // 在成功加载配置文件后重置标签页
      }
    };
    input.click();
  };

  const handleSave = () => {
    if (settings) {
      downloadSettings(settings, appConfig.paths.defaultSaveFile);
    }
  };

  const handleDownloadEmpty = () => {
    const blob = new Blob(['{}'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = appConfig.paths.defaultSaveFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadMenuAnchorEl(null);
  };

  const handleDownloadMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadMenuAnchorEl(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchorEl(null);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCopyPath = async () => {
    const path = appConfig.paths.defaultSavePath;
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
            <Chip
              icon={<CompatibleIcon />}
              label={`${getDefaultTranslation('app.compatibility.compatible')}${appConfig.version.compatibleVersion}`}
              size="small"
              color="success"
              sx={{ 
                ml: 2,
                bgcolor: 'success.dark',
                '& .MuiChip-icon': {
                  color: 'inherit'
                }
              }}
            />
          </Typography>
          <Button color="inherit" onClick={handleFileClick}>
            {getDefaultTranslation('app.buttons.openConfig')}
          </Button>
          <Box sx={{ width: 6 }} />
          <ButtonGroup 
            variant="text" 
            color="inherit" 
            sx={{ 
              '& .MuiButtonGroup-grouped:not(:last-of-type)': {
                borderColor: 'transparent'
              }
            }}
          >
            <Button onClick={handleSave} disabled={!settings}>
              {getDefaultTranslation('app.buttons.downloadConfig')}
            </Button>
            <Button
              size="small"
              onClick={handleDownloadMenuClick}
              sx={{ minWidth: '32px', pl: 0, pr: 0 }}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Menu
            anchorEl={downloadMenuAnchorEl}
            open={Boolean(downloadMenuAnchorEl)}
            onClose={handleDownloadMenuClose}
          >
            <MenuItem onClick={handleDownloadEmpty}>
              {getDefaultTranslation('app.buttons.downloadEmptyConfig')}
            </MenuItem>
          </Menu>
          <Box sx={{ width: 16 }} />
          <LanguageSelector />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        {settings ? (
          availableTabs.length > 0 ? (
            <>
              <Paper sx={{ mt: 2 }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  indicatorColor="primary"
                  textColor="primary"
                >
                  {availableTabs.map((tab, index) => (
                    <Tab 
                      key={tab.key} 
                      icon={tab.icon} 
                      label={getDefaultTranslation(tab.label)} 
                    />
                  ))}
                </Tabs>
              </Paper>
              <TabPanel value={currentTab} index={currentTab}>
                {React.createElement(availableTabs[currentTab].component, {
                  settings,
                  onChange: setSettings,
                  ...availableTabs[currentTab].props
                })}
              </TabPanel>
            </>
          ) : (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
              {getDefaultTranslation('app.error.noSettings')}
            </Typography>
          )
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
