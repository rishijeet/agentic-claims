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
  AccountBalance as AccountIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { CustomerContext, Transaction } from '../types';
import { DatabaseService } from '../services/database';
import AddCustomerDialog from './AddCustomerDialog';

interface CustomerSearchProps {
  onCustomerSelect?: (customer: CustomerContext) => void;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({ onCustomerSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CustomerContext[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setSearchPerformed(true);
    
    try {
      console.log('Searching for:', searchQuery);
      
      // Get all customers from the database
      const customers = await DatabaseService.getAllCustomers();
      console.log('Customers from database:', customers);
      
      if (customers.length === 0) {
        console.log('No customers found in database');
      } else {
        console.log('Found', customers.length, 'customers in database');
      }
      
      // Filter customers based on search query
      const results = customers.filter(customer => {
        const nameMatch = customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const emailMatch = customer.email.toLowerCase().includes(searchQuery.toLowerCase());
        const idMatch = customer.id.toLowerCase().includes(searchQuery.toLowerCase());
        
        console.log('Customer:', customer.name, 
          'Name match:', nameMatch, 
          'Email match:', emailMatch, 
          'ID match:', idMatch);
        
        return nameMatch || emailMatch || idMatch;
      });
      
      console.log('Filtered results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching customers:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerSelect = (customer: CustomerContext) => {
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

  const handleCustomerAdded = (customer: CustomerContext) => {
    // Refresh search results if we have a search query
    if (searchQuery) {
      handleSearch();
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
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => setShowAddCustomerDialog(true)}
            startIcon={<AddIcon />}
          >
            Add New Customer
          </Button>
        </Box>
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
                        <TableCell>Description</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedCustomer.transactions.map((transaction) => (
                        <TableRow key={transaction.id} hover>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
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
      
      <AddCustomerDialog
        open={showAddCustomerDialog}
        onClose={() => setShowAddCustomerDialog(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </Box>
  );
};

export default CustomerSearch; 