import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { CustomerContext, Transaction } from '../types';
import { DatabaseService } from '../services/database';

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onCustomerAdded: (customer: CustomerContext) => void;
}

export const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({
  open,
  onClose,
  onCustomerAdded,
}) => {
  const [customer, setCustomer] = useState<Partial<CustomerContext>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    accountNumber: '',
    accountType: 'Checking',
    balance: 0,
    transactions: [],
  });

  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    type: 'debit',
  });

  const handleChange = (field: keyof CustomerContext) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCustomer((prev) => ({
      ...prev,
      [field]: field === 'balance' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTransactionChange = (field: keyof Transaction) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setNewTransaction((prev) => ({
      ...prev,
      [field]: field === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      return;
    }

    const transaction: Transaction = {
      id: `TRX-${Date.now()}`,
      date: newTransaction.date || new Date().toISOString().split('T')[0],
      description: newTransaction.description,
      amount: newTransaction.amount,
      type: newTransaction.type || 'debit',
    };

    setCustomer((prev) => ({
      ...prev,
      transactions: [...(prev.transactions || []), transaction],
    }));

    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      type: 'debit',
    });
  };

  const handleRemoveTransaction = (transactionId: string) => {
    setCustomer((prev) => ({
      ...prev,
      transactions: prev.transactions?.filter((t) => t.id !== transactionId) || [],
    }));
  };

  const handleSubmit = async () => {
    if (!customer.name || !customer.email) {
      return;
    }

    const newCustomer: CustomerContext = {
      id: `CUST-${Date.now()}`,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      accountNumber: customer.accountNumber || '',
      accountType: customer.accountType || 'Checking',
      balance: customer.balance || 0,
      transactions: customer.transactions || [],
    };

    try {
      await DatabaseService.addCustomer(newCustomer);
      onCustomerAdded(newCustomer);
      onClose();
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Customer</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={customer.name}
              onChange={handleChange('name')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={customer.email}
              onChange={handleChange('email')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={customer.phone}
              onChange={handleChange('phone')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              value={customer.address}
              onChange={handleChange('address')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Number"
              value={customer.accountNumber}
              onChange={handleChange('accountNumber')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Type"
              value={customer.accountType}
              onChange={handleChange('accountType')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Balance"
              type="number"
              value={customer.balance}
              onChange={handleChange('balance')}
              InputProps={{
                startAdornment: '$',
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add Transaction
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={newTransaction.date}
                onChange={handleTransactionChange('date')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Description"
                value={newTransaction.description}
                onChange={handleTransactionChange('description')}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={newTransaction.amount}
                onChange={handleTransactionChange('amount')}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                select
                label="Type"
                value={newTransaction.type}
                onChange={handleTransactionChange('type')}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddTransaction}
                startIcon={<AddIcon />}
                sx={{ height: '100%' }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Box>

        {customer.transactions && customer.transactions.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transactions
            </Typography>
            <Grid container spacing={2}>
              {customer.transactions.map((transaction) => (
                <Grid item xs={12} key={transaction.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Typography>{transaction.date}</Typography>
                    <Typography flex={1}>{transaction.description}</Typography>
                    <Typography
                      sx={{
                        color: transaction.type === 'credit' ? 'success.main' : 'error.main',
                      }}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveTransaction(transaction.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!customer.name || !customer.email}
        >
          Add Customer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerDialog; 