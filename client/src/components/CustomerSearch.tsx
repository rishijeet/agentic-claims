/**
 * @author Rishijeet
 */

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { 
  Search as SearchIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccountBalance as AccountIcon
} from '@mui/icons-material';

// Dummy customer data
const dummyCustomers = [
  {
    id: 'CUST001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, CA 90210',
    accountNumber: '**** **** **** 1234',
    accountType: 'Checking',
    balance: 2547.89,
    transactions: [
      { id: 'TXN001', date: '2023-06-15', merchant: 'Amazon', amount: -89.99, status: 'completed', type: 'purchase' },
      { id: 'TXN002', date: '2023-06-14', merchant: 'Walmart', amount: -125.50, status: 'completed', type: 'purchase' },
      { id: 'TXN003', date: '2023-06-13', merchant: 'Starbucks', amount: -4.75, status: 'completed', type: 'purchase' },
      { id: 'TXN004', date: '2023-06-12', merchant: 'Netflix', amount: -14.99, status: 'completed', type: 'subscription' },
      { id: 'TXN005', date: '2023-06-11', merchant: 'Salary Deposit', amount: 3200.00, status: 'completed', type: 'deposit' },
      { id: 'TXN006', date: '2023-06-10', merchant: 'Target', amount: -65.25, status: 'completed', type: 'purchase' },
      { id: 'TXN007', date: '2023-06-09', merchant: 'Uber', amount: -22.50, status: 'completed', type: 'transportation' },
      { id: 'TXN008', date: '2023-06-08', merchant: 'Restaurant', amount: -45.80, status: 'completed', type: 'dining' },
      { id: 'TXN009', date: '2023-06-07', merchant: 'Gas Station', amount: -35.20, status: 'completed', type: 'fuel' },
      { id: 'TXN010', date: '2023-06-06', merchant: 'Online Shopping', amount: -78.30, status: 'completed', type: 'purchase' }
    ]
  },
  {
    id: 'CUST002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 234-5678',
    address: '456 Oak Ave, Somewhere, NY 10001',
    accountNumber: '**** **** **** 5678',
    accountType: 'Savings',
    balance: 8750.42,
    transactions: [
      { id: 'TXN011', date: '2023-06-15', merchant: 'Target', amount: -120.75, status: 'completed', type: 'purchase' },
      { id: 'TXN012', date: '2023-06-14', merchant: 'Amazon', amount: -45.99, status: 'completed', type: 'purchase' },
      { id: 'TXN013', date: '2023-06-13', merchant: 'Salary Deposit', amount: 2800.00, status: 'completed', type: 'deposit' },
      { id: 'TXN014', date: '2023-06-12', merchant: 'Restaurant', amount: -65.30, status: 'completed', type: 'dining' },
      { id: 'TXN015', date: '2023-06-11', merchant: 'Gym Membership', amount: -49.99, status: 'completed', type: 'subscription' },
      { id: 'TXN016', date: '2023-06-10', merchant: 'Gas Station', amount: -42.50, status: 'completed', type: 'fuel' },
      { id: 'TXN017', date: '2023-06-09', merchant: 'Online Shopping', amount: -95.25, status: 'completed', type: 'purchase' },
      { id: 'TXN018', date: '2023-06-08', merchant: 'Uber', amount: -18.75, status: 'completed', type: 'transportation' },
      { id: 'TXN019', date: '2023-06-07', merchant: 'Starbucks', amount: -5.25, status: 'completed', type: 'dining' },
      { id: 'TXN020', date: '2023-06-06', merchant: 'Walmart', amount: -85.60, status: 'completed', type: 'purchase' }
    ]
  },
  {
    id: 'CUST003',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '(555) 345-6789',
    address: '789 Pine St, Elsewhere, TX 75001',
    accountNumber: '**** **** **** 9012',
    accountType: 'Checking',
    balance: 1250.75,
    transactions: [
      { id: 'TXN021', date: '2023-06-15', merchant: 'Restaurant', amount: -55.80, status: 'completed', type: 'dining' },
      { id: 'TXN022', date: '2023-06-14', merchant: 'Salary Deposit', amount: 3500.00, status: 'completed', type: 'deposit' },
      { id: 'TXN023', date: '2023-06-13', merchant: 'Amazon', amount: -120.50, status: 'completed', type: 'purchase' },
      { id: 'TXN024', date: '2023-06-12', merchant: 'Netflix', amount: -14.99, status: 'completed', type: 'subscription' },
      { id: 'TXN025', date: '2023-06-11', merchant: 'Gas Station', amount: -38.25, status: 'completed', type: 'fuel' },
      { id: 'TXN026', date: '2023-06-10', merchant: 'Target', amount: -75.30, status: 'completed', type: 'purchase' },
      { id: 'TXN027', date: '2023-06-09', merchant: 'Uber', amount: -25.50, status: 'completed', type: 'transportation' },
      { id: 'TXN028', date: '2023-06-08', merchant: 'Online Shopping', amount: -65.75, status: 'completed', type: 'purchase' },
      { id: 'TXN029', date: '2023-06-07', merchant: 'Starbucks', amount: -4.50, status: 'completed', type: 'dining' },
      { id: 'TXN030', date: '2023-06-06', merchant: 'Walmart', amount: -95.20, status: 'completed', type: 'purchase' }
    ]
  },
  {
    id: 'CUST004',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '(555) 456-7890',
    address: '321 Elm St, Nowhere, FL 33101',
    accountNumber: '**** **** **** 3456',
    accountType: 'Savings',
    balance: 5430.25,
    transactions: [
      { id: 'TXN031', date: '2023-06-15', merchant: 'Amazon', amount: -75.50, status: 'completed', type: 'purchase' },
      { id: 'TXN032', date: '2023-06-14', merchant: 'Salary Deposit', amount: 2900.00, status: 'completed', type: 'deposit' },
      { id: 'TXN033', date: '2023-06-13', merchant: 'Restaurant', amount: -42.80, status: 'completed', type: 'dining' },
      { id: 'TXN034', date: '2023-06-12', merchant: 'Spotify', amount: -9.99, status: 'completed', type: 'subscription' },
      { id: 'TXN035', date: '2023-06-11', merchant: 'Target', amount: -110.25, status: 'completed', type: 'purchase' },
      { id: 'TXN036', date: '2023-06-10', merchant: 'Gas Station', amount: -45.30, status: 'completed', type: 'fuel' },
      { id: 'TXN037', date: '2023-06-09', merchant: 'Lyft', amount: -28.75, status: 'completed', type: 'transportation' },
      { id: 'TXN038', date: '2023-06-08', merchant: 'Online Shopping', amount: -85.60, status: 'completed', type: 'purchase' },
      { id: 'TXN039', date: '2023-06-07', merchant: 'Starbucks', amount: -5.25, status: 'completed', type: 'dining' },
      { id: 'TXN040', date: '2023-06-06', merchant: 'Walmart', amount: -65.40, status: 'completed', type: 'purchase' }
    ]
  }
];

interface CustomerSearchProps {
  onCustomerSelect?: (customer: any) => void;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({ onCustomerSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    setSearchPerformed(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = dummyCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(results);
      setIsLoading(false);
    }, 1000);
  };

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'success';
      case 'purchase':
        return 'error';
      case 'subscription':
        return 'info';
      case 'dining':
        return 'warning';
      case 'transportation':
        return 'secondary';
      case 'fuel':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customer Search
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search by Name, Email, or Customer ID"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {searchPerformed && !isLoading && searchResults.length === 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No customers found matching your search criteria.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try searching with a different name, email, or customer ID.
          </Typography>
        </Paper>
      )}
      
      {searchResults.length > 0 && !selectedCustomer && (
        <Paper elevation={3} sx={{ mb: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      {selectedCustomer && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardHeader 
                title="Customer Information" 
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                    {selectedCustomer.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedCustomer.name}</Typography>
                    <Typography variant="body2" color="text.secondary">ID: {selectedCustomer.id}</Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{selectedCustomer.email}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{selectedCustomer.phone}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{selectedCustomer.address}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccountIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {selectedCustomer.accountType} Account: {selectedCustomer.accountNumber}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreditCardIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Balance: {formatCurrency(selectedCustomer.balance)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardHeader 
                title="Recent Transactions" 
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><CreditCardIcon /></Avatar>}
              />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Merchant</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedCustomer.transactions.map((transaction: any) => (
                        <TableRow key={transaction.id} hover>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell>{transaction.merchant}</TableCell>
                          <TableCell>
                            <Chip 
                              label={transaction.type} 
                              size="small" 
                              color={getTransactionTypeColor(transaction.type) as any}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ 
                            color: transaction.amount > 0 ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CustomerSearch; 