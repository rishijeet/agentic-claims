/**
 * @author Rishijeet
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  useMediaQuery, 
  Tabs, 
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Home as HomeIcon, 
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import ChatInterface from './components/ChatInterface';
import HomePage from './components/HomePage';
import AgentSidebar from './components/AgentSidebar';
import CustomerSearch from './components/CustomerSearch';
import { CustomerContext, Message, DisputeCase } from './types';
import { DatabaseService } from './services/database';
import CreateDisputeDialog from './components/CreateDisputeDialog';

const theme = createTheme({
  palette: {
    mode: 'light',
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

export const App: React.FC = () => {
  // UI state
  const [selectedTab, setSelectedTab] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAgentSidebar, setShowAgentSidebar] = useState(true);
  const [chatDimensions, setChatDimensions] = useState({ width: 400, height: 500 });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<number | null>(null);
  const [agentName] = useState('John Doe');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showCreateDisputeDialog, setShowCreateDisputeDialog] = useState(false);

  // Data state
  const [customerContext, setCustomerContext] = useState<CustomerContext | null>(null);
  const [disputeCases, setDisputeCases] = useState<DisputeCase[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your dispute resolution assistant. How can I help you today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);

  // Load dispute cases from database on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Initializing database...');
        // Initialize database with sample data if needed
        await DatabaseService.initializeWithSampleData();
        
        // Load dispute cases from database
        const cases = await DatabaseService.getAllDisputeCases();
        console.log('Loaded dispute cases:', cases);
        setDisputeCases(cases);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (customerContext) {
      setPendingTabChange(newValue);
      setShowConfirmDialog(true);
    } else {
      setSelectedTab(newValue);
    }
  };

  const handleConfirmTabChange = () => {
    if (pendingTabChange !== null) {
      setSelectedTab(pendingTabChange);
      setCustomerContext(null);
      setIsChatOpen(false);
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

  const handleCustomerSelect = (selectedCustomer: CustomerContext) => {
    setCustomerContext(selectedCustomer);
    setIsChatOpen(true);
  };

  const handleCreateDispute = async (dispute: {
    id: string;
    customerName: string;
    status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
    type: string;
    amount: number;
    date: string;
    priority: 'high' | 'medium' | 'low';
  }) => {
    try {
      // Save to database
      await DatabaseService.saveDisputeCase(dispute);
      
      // Update state
      setDisputeCases(prevCases => [dispute, ...prevCases]);
    } catch (error) {
      console.error('Error creating dispute:', error);
    }
  };

  const handleResize = (event: any, { size }: { size: { width: number; height: number } }) => {
    setChatDimensions({ width: size.width, height: size.height });
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  const handleDisputeCaseClick = (caseId: string) => {
    // Handle dispute case click
    console.log('Dispute case clicked:', caseId);
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
            <IconButton
              color="inherit"
              onClick={() => setShowCreateDisputeDialog(true)}
            >
              <AddIcon />
            </IconButton>
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
                value={selectedTab} 
                onChange={handleTabChange} 
                aria-label="basic tabs example"
                centered
              >
                <Tab icon={<HomeIcon />} label="Home" {...a11yProps(0)} />
                <Tab icon={<SearchIcon />} label="Customer Search" {...a11yProps(1)} />
              </Tabs>
            </Box>
            
            <TabPanel value={selectedTab} index={0}>
              <HomePage />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <CustomerSearch onCustomerSelect={handleCustomerSelect} />
            </TabPanel>
          </Box>

          {showAgentSidebar && !isMobile && (
            <Box
              sx={{
                width: 300,
                position: 'fixed',
                right: 0,
                top: 64,
                bottom: 0,
                bgcolor: 'background.paper',
                borderLeft: 1,
                borderColor: 'divider',
                overflowY: 'auto',
              }}
            >
              <AgentSidebar 
                agentName={agentName}
                disputeCases={disputeCases}
              />
            </Box>
          )}

          {isChatOpen && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                zIndex: 1000,
              }}
            >
              <ResizableBox
                width={chatDimensions.width}
                height={chatDimensions.height}
                onResize={handleResize}
                minConstraints={[300, 400]}
                maxConstraints={[600, 800]}
                resizeHandles={['w', 'n', 'nw']}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    overflow: 'hidden',
                  }}
                >
                  <ChatInterface 
                    agentName={agentName}
                    customerContext={customerContext || undefined}
                    onClose={handleChatClose}
                  />
                </Box>
              </ResizableBox>
            </Box>
          )}

          <Dialog
            open={showConfirmDialog}
            onClose={handleCancelTabChange}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Switch tabs?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Switching tabs will clear the current customer context. Do you want to proceed?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelTabChange}>Cancel</Button>
              <Button onClick={handleConfirmTabChange} autoFocus>
                Proceed
              </Button>
            </DialogActions>
          </Dialog>

          <CreateDisputeDialog
            open={showCreateDisputeDialog}
            onClose={() => setShowCreateDisputeDialog(false)}
            onSubmit={handleCreateDispute}
            customerName={customerContext?.name}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App; 