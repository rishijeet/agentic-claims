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
  Close as CloseIcon
} from '@mui/icons-material';

interface DisputeCase {
  id: string;
  customerName: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  type: string;
  amount: number;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

const AgentSidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  
  // Mock data for dispute cases
  const disputeCases: DisputeCase[] = [
    {
      id: 'DISP-001',
      customerName: 'John Smith',
      status: 'in-progress',
      type: 'Unauthorized Transaction',
      amount: 125.50,
      date: '2023-06-15',
      priority: 'high'
    },
    {
      id: 'DISP-002',
      customerName: 'Sarah Johnson',
      status: 'pending',
      type: 'Double Charge',
      amount: 75.00,
      date: '2023-06-14',
      priority: 'medium'
    },
    {
      id: 'DISP-003',
      customerName: 'Michael Brown',
      status: 'resolved',
      type: 'Failed Refund',
      amount: 250.00,
      date: '2023-06-13',
      priority: 'low'
    },
    {
      id: 'DISP-004',
      customerName: 'Emily Davis',
      status: 'rejected',
      type: 'Quality Issue',
      amount: 89.99,
      date: '2023-06-12',
      priority: 'medium'
    }
  ];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'in-progress':
        return <InfoIcon color="info" />;
      case 'resolved':
        return <CheckCircleIcon color="success" />;
      case 'rejected':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon />;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
        height: '100%', 
        width: '300px', 
        overflow: 'auto',
        borderRadius: 0,
        borderLeft: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Agent Dashboard
        </Typography>
        <IconButton size="small" onClick={() => setOpen(!open)}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">Agent Rishijeet</Typography>
            <Typography variant="body2" color="text.secondary">Online</Typography>
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
                selected={selectedCase === case_.id}
                onClick={() => setSelectedCase(case_.id)}
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
              <Collapse in={selectedCase === case_.id} timeout="auto" unmountOnExit>
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