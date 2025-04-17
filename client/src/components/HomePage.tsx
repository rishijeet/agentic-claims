/**
 * @author Rishijeet
 */

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  Help as HelpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Debit Card Dispute Resolution
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Our AI-powered system helps you resolve debit card disputes quickly and efficiently.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Common Dispute Types" 
              avatar={<SecurityIcon color="primary" />}
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Unauthorized Transactions" 
                    secondary="Transactions you didn't authorize or recognize"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Double Charges" 
                    secondary="When a merchant charges you twice for the same purchase"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Failed Refunds" 
                    secondary="When a merchant doesn't process your refund correctly"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Quality Issues" 
                    secondary="When you receive defective or incorrect items"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Dispute Process" 
              avatar={<TimelineIcon color="primary" />}
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="1. Start a Dispute" 
                    secondary="Click the 'Start New Dispute' button to begin"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="2. Provide Information" 
                    secondary="Answer questions about your transaction and communication with the merchant"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="3. Review Details" 
                    secondary="Confirm all information is correct before submission"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="4. Track Progress" 
                    secondary="Monitor the status of your dispute through the chat interface"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader 
              title="Tips for Successful Disputes" 
              avatar={<HelpIcon color="primary" />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <WarningIcon color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Contact the Merchant First
                    </Typography>
                    <Typography variant="body2">
                      Always try to resolve the issue directly with the merchant before filing a dispute. This is often the fastest way to resolve problems.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <WarningIcon color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Gather Documentation
                    </Typography>
                    <Typography variant="body2">
                      Collect receipts, emails, and any other documentation that supports your claim. This will help speed up the dispute process.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <WarningIcon color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Be Specific
                    </Typography>
                    <Typography variant="body2">
                      Provide clear, detailed information about the issue. Include dates, amounts, and specific reasons for your dispute.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage; 