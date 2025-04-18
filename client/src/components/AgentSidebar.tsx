/**
 * @author Rishijeet
 */

import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  IconButton,
  Collapse,
  Badge,
  Avatar,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  Person as PersonIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Chat as ChatIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  FiberManualRecord as StatusIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { DisputeCase } from '../types';

interface AgentSidebarProps {
  open?: boolean;
  onClose?: () => void;
  agentName?: string;
  disputeCases: DisputeCase[];
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({ 
  open = true, 
  onClose,
  agentName = 'John Doe',
  disputeCases
}) => {
  const [selectedCase, setSelectedCase] = useState<DisputeCase | null>(null);
  const theme = useTheme();
  
  const handleCaseSelect = (case_: DisputeCase) => {
    setSelectedCase(case_);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <StatusIcon sx={{ color: 'success.main', fontSize: 12 }} />;
      case 'pending':
        return <StatusIcon sx={{ color: 'warning.main', fontSize: 12 }} />;
      case 'closed':
        return <StatusIcon sx={{ color: 'error.main', fontSize: 12 }} />;
      default:
        return <StatusIcon sx={{ color: 'grey.500', fontSize: 12 }} />;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };
  
  return (
    <Paper
      elevation={3}
      sx={{
        width: 300,
        height: '100%',
        display: open ? 'block' : 'none',
        overflow: 'auto',
        p: 2,
        borderLeft: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Agent Dashboard
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
            {agentName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">{agentName}</Typography>
            <Typography variant="body2" color="success.main">
              Online
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">12</Typography>
            <Typography variant="body2" color="text.secondary">Active Cases</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">45</Typography>
            <Typography variant="body2" color="text.secondary">Resolved Today</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">98%</Typography>
            <Typography variant="body2" color="text.secondary">Success Rate</Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Recent Dispute Cases
        </Typography>
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {disputeCases.map((case_) => (
            <React.Fragment key={case_.id}>
              <ListItem 
                button 
                selected={selectedCase === case_}
                onClick={() => handleCaseSelect(case_)}
                sx={{ 
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <ListItemIcon>
                  {getStatusIcon(case_.status)}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {case_.customerName}
                      </Typography>
                      <Chip 
                        label={case_.priority} 
                        size="small" 
                        color={getPriorityColor(case_.priority) as any}
                        sx={{ height: '20px', fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        ${case_.amount.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {case_.date}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Collapse in={selectedCase === case_} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Type:</strong> {case_.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Status:</strong> {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary">
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chat with Customer">
                      <IconButton size="small" color="primary">
                        <ChatIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Close Case">
                      <IconButton size="small" color="error">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default AgentSidebar; 