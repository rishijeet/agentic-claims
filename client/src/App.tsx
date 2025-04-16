/**
 * @author Rishijeet
 */

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, AppBar, Toolbar, Typography, Paper } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a237e', // Deep blue for enterprise feel
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#c62828', // Deep red for accents
      light: '#ff5f52',
      dark: '#8e0000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <AccountBalanceIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Agentic Claims
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: 'calc(100vh - 140px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <ChatInterface />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 