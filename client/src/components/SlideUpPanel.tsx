import React from 'react';
import { Box, Paper, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

interface SlideUpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SlideUpContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1200,
  transform: 'translateY(100%)',
  transition: 'transform 0.3s ease-in-out',
  '&.open': {
    transform: 'translateY(0)',
  },
}));

const SlideUpContent = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '60vh',
  maxHeight: '800px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px 16px 0 0',
  overflow: 'hidden',
  boxShadow: theme.shadows[8],
}));

const SlideUpHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

export const SlideUpPanel: React.FC<SlideUpPanelProps> = ({ isOpen, onClose, children }) => {
  return (
    <SlideUpContainer className={isOpen ? 'open' : ''}>
      <SlideUpContent>
        <SlideUpHeader>
          <Typography variant="h6" sx={{ ml: 2, fontSize: '1rem', fontWeight: 500 }}>
            Dispute Chat
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'inherit',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </SlideUpHeader>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {children}
        </Box>
      </SlideUpContent>
    </SlideUpContainer>
  );
}; 