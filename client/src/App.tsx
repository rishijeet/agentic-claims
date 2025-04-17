/**
 * @author Rishijeet
 */

import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  useMediaQuery, 
  Tabs, 
  Tab,
  Fab,
  Zoom,
  Paper,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Chat as ChatIcon, 
  Home as HomeIcon, 
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import ChatInterface from './components/ChatInterface';
import HomePage from './components/HomePage';
import AgentSidebar from './components/AgentSidebar';
import CustomerSearch from './components/CustomerSearch';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

function App() {
  const [showAgentSidebar, setShowAgentSidebar] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [customerContext, setCustomerContext] = useState<any>(null);
  const [chatDimensions, setChatDimensions] = useState({ width: 400, height: 500 });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your dispute resolution assistant. How can I help you today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (customerContext) {
      setPendingTabChange(newValue);
      setShowConfirmDialog(true);
    } else {
      setTabValue(newValue);
    }
  };

  const handleConfirmTabChange = () => {
    if (pendingTabChange !== null) {
      setTabValue(pendingTabChange);
      setCustomerContext(null);
      setShowChat(false);
      setChatMessages([
        {
          id: Date.now().toString(),
          text: 'Hello! I\'m your dispute resolution assistant. How can I help you today?',
          sender: 'agent',
          timestamp: new Date()
        }
      ]);
    }
    setShowConfirmDialog(false);
    setPendingTabChange(null);
  };

  const handleCancelTabChange = () => {
    setShowConfirmDialog(false);
    setPendingTabChange(null);
  };

  const toggleAgentSidebar = () => {
    setShowAgentSidebar(!showAgentSidebar);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleCustomerSelect = (customer: any) => {
    setCustomerContext(customer);
    setShowChat(true);
  };

  const handleResize = (event: any, { size }: { size: { width: number; height: number } }) => {
    setChatDimensions({ width: size.width, height: size.height });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleAgentSidebar}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Agentic Claims
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
          <Box sx={{ 
            flex: 1, 
            transition: 'margin 0.3s ease',
            marginRight: showAgentSidebar && !isMobile ? '300px' : 0
          }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="basic tabs example"
                centered
              >
                <Tab icon={<HomeIcon />} label="Home" {...a11yProps(0)} />
                <Tab icon={<SearchIcon />} label="Customer Search" {...a11yProps(1)} />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <HomePage />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <CustomerSearch onCustomerSelect={handleCustomerSelect} />
            </TabPanel>
          </Box>
          
          {!isMobile && showAgentSidebar && (
            <Box sx={{ 
              position: 'fixed',
              right: 0,
              top: 64,
              bottom: 0,
              width: '300px',
              zIndex: 1
            }}>
              <AgentSidebar />
            </Box>
          )}
          
          {isMobile && (
            <Drawer
              anchor="right"
              open={showAgentSidebar}
              onClose={toggleAgentSidebar}
              sx={{
                '& .MuiDrawer-paper': {
                  width: '300px',
                },
              }}
            >
              <AgentSidebar />
            </Drawer>
          )}
        </Box>

        {/* Resizable Chat Interface */}
        <Fade in={showChat} timeout={300}>
          <div style={{ 
            position: 'fixed',
            bottom: 0,
            right: 0,
            zIndex: 1200,
          }}>
            <ResizableBox
              width={chatDimensions.width}
              height={chatDimensions.height}
              minConstraints={[350, 400]}
              maxConstraints={[800, 900]}
              onResize={handleResize}
              resizeHandles={['nw', 'ne', 'sw', 'se']}
              style={{
                margin: '16px',
                borderRadius: '16px',
                overflow: 'hidden'
              }}
            >
              <Paper 
                elevation={3} 
                sx={{ 
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'move',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}>
                  <Typography variant="h6" sx={{ ml: 2, fontSize: '1rem', fontWeight: 500 }}>
                    Dispute Chat
                    {customerContext && ` - ${customerContext.name}`}
                  </Typography>
                  <IconButton 
                    onClick={toggleChat} 
                    size="small"
                    sx={{ 
                      color: 'inherit',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ 
                  flex: 1, 
                  overflow: 'auto', 
                  p: 2,
                  bgcolor: 'background.default'
                }}>
                  <ChatInterface 
                    customerContext={customerContext}
                    messages={chatMessages}
                    onMessagesChange={setChatMessages}
                  />
                </Box>
              </Paper>
            </ResizableBox>
          </div>
        </Fade>

        {/* Floating Action Button to open chat */}
        <Zoom in={!showChat}>
          <Fab 
            color="primary" 
            aria-label="chat" 
            sx={{ 
              position: 'fixed', 
              bottom: 16, 
              right: 16,
              '&:hover': {
                transform: 'scale(1.05)',
              },
              transition: 'transform 0.2s ease-in-out'
            }}
            onClick={toggleChat}
          >
            <ChatIcon />
          </Fab>
        </Zoom>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={handleCancelTabChange}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Leave Customer Details?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Leaving this page will clear the current customer context and close the chat. Are you sure you want to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelTabChange} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmTabChange} color="primary" autoFocus>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App; 