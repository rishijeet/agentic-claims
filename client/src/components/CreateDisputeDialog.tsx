import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DisputeCase, CustomerContext } from '../types';
import { DatabaseService } from '../services/database';

interface CreateDisputeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (dispute: DisputeCase) => void;
  customerName?: string;
}

export const CreateDisputeDialog: React.FC<CreateDisputeDialogProps> = ({
  open,
  onClose,
  onSubmit,
  customerName = '',
}) => {
  const [dispute, setDispute] = useState<Partial<DisputeCase>>({
    customerName,
    status: 'pending',
    type: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    priority: 'medium',
  });

  const [customers, setCustomers] = useState<CustomerContext[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoadingCustomers(true);
      try {
        const loadedCustomers = await DatabaseService.getAllCustomers();
        setCustomers(loadedCustomers);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    if (open) {
      loadCustomers();
    }
  }, [open]);

  const handleChange = (field: keyof DisputeCase) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setDispute((prev) => ({
      ...prev,
      [field]: field === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = () => {
    if (!dispute.type || !dispute.amount || !dispute.customerName) {
      return;
    }

    const newDispute: DisputeCase = {
      id: `DISP-${Date.now()}`,
      customerName: dispute.customerName,
      status: 'pending',
      type: dispute.type,
      amount: dispute.amount,
      date: dispute.date || new Date().toISOString().split('T')[0],
      priority: dispute.priority || 'medium',
    };

    onSubmit(newDispute);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Dispute</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="customer-select-label">Customer</InputLabel>
              <Select
                labelId="customer-select-label"
                value={dispute.customerName}
                onChange={(e) => setDispute(prev => ({ ...prev, customerName: e.target.value }))}
                label="Customer"
                disabled={!!customerName}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.name}>
                    {customer.name} ({customer.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Dispute Type"
              value={dispute.type}
              onChange={handleChange('type')}
              required
            >
              <MenuItem value="Service Not Received">Service Not Received</MenuItem>
              <MenuItem value="Unauthorized Transaction">Unauthorized Transaction</MenuItem>
              <MenuItem value="Double Charge">Double Charge</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={dispute.amount}
              onChange={handleChange('amount')}
              required
              InputProps={{
                startAdornment: '$',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Priority"
              value={dispute.priority}
              onChange={handleChange('priority')}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!dispute.type || !dispute.amount || !dispute.customerName}
        >
          Create Dispute
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDisputeDialog; 