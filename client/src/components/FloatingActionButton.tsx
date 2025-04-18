import React from 'react';
import { Fab, Badge } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { styled } from '@mui/material/styles';

interface FloatingActionButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1100,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, unreadCount = 0 }) => {
  return (
    <StyledFab onClick={onClick} aria-label="open chat">
      <Badge badgeContent={unreadCount} color="error">
        <ChatIcon />
      </Badge>
    </StyledFab>
  );
}; 