/**
 * @author Rishijeet
 */

import Dexie, { Table } from 'dexie';
import { DisputeCase, CustomerContext, Transaction, Message } from '../types';

class AgenticClaimsDB extends Dexie {
  disputeCases!: Table<DisputeCase>;
  customers!: Table<CustomerContext>;
  messages!: Table<Message>;

  constructor() {
    super('AgenticClaimsDB');
    this.version(1).stores({
      disputeCases: 'id, customerName, status, date',
      customers: 'id, name, email',
      messages: 'id, sender, timestamp'
    });
  }
}

export const db = new AgenticClaimsDB();

// Helper functions for common operations
export const DatabaseService = {
  // Dispute Cases
  saveDisputeCase: async (disputeCase: DisputeCase) => {
    try {
      await db.disputeCases.put(disputeCase);
      return true;
    } catch (error) {
      console.error('Error saving dispute case:', error);
      return false;
    }
  },

  getAllDisputeCases: async () => {
    try {
      return await db.disputeCases.toArray();
    } catch (error) {
      console.error('Error getting dispute cases:', error);
      return [];
    }
  },

  getDisputeCaseById: async (id: string) => {
    try {
      return await db.disputeCases.get(id);
    } catch (error) {
      console.error('Error getting dispute case by ID:', error);
      return null;
    }
  },

  updateDisputeCase: async (disputeCase: DisputeCase) => {
    try {
      await db.disputeCases.update(disputeCase.id, disputeCase);
      return true;
    } catch (error) {
      console.error('Error updating dispute case:', error);
      return false;
    }
  },

  deleteDisputeCase: async (id: string) => {
    try {
      await db.disputeCases.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting dispute case:', error);
      return false;
    }
  },

  // Customers
  saveCustomer: async (customer: CustomerContext) => {
    try {
      await db.customers.put(customer);
      return true;
    } catch (error) {
      console.error('Error saving customer:', error);
      return false;
    }
  },

  getAllCustomers: async () => {
    try {
      return await db.customers.toArray();
    } catch (error) {
      console.error('Error getting customers:', error);
      return [];
    }
  },

  getCustomerById: async (id: string) => {
    try {
      return await db.customers.get(id);
    } catch (error) {
      console.error('Error getting customer by ID:', error);
      return null;
    }
  },

  // Messages
  saveMessage: async (message: Message) => {
    try {
      await db.messages.put(message);
      return true;
    } catch (error) {
      console.error('Error saving message:', error);
      return false;
    }
  },

  getMessagesByCustomerId: async (customerId: string) => {
    try {
      return await db.messages.where('customerId').equals(customerId).toArray();
    } catch (error) {
      console.error('Error getting messages by customer ID:', error);
      return [];
    }
  },

  // Initialize with sample data if needed
  initializeWithSampleData: async () => {
    try {
      console.log('Initializing database with sample data...');
      
      // Check if we already have data
      const disputeCount = await db.disputeCases.count();
      const customerCount = await db.customers.count();
      
      console.log('Current database state - Disputes:', disputeCount, 'Customers:', customerCount);
      
      if (disputeCount > 0 && customerCount > 0) {
        console.log('Database already initialized with data');
        return;
      }

      // Add sample customers if needed
      if (customerCount === 0) {
        console.log('Adding sample customers...');
        const sampleCustomers: CustomerContext[] = [
          {
            id: 'CUST001',
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '(555) 123-4567',
            address: '123 Main St, Anytown, CA 90210',
            accountNumber: '**** **** **** 1234',
            accountType: 'Checking',
            balance: 2543.75,
            transactions: [
              { id: 'T001', date: '2024-03-15', description: 'Walmart Supercenter', amount: -89.99, type: 'debit' },
              { id: 'T002', date: '2024-03-14', description: 'Amazon.com', amount: -125.50, type: 'debit' }
            ]
          },
          {
            id: 'CUST002',
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            phone: '(555) 456-7890',
            address: '321 Elm St, Nowhere, FL 33101',
            accountNumber: '**** **** **** 3456',
            accountType: 'Savings',
            balance: 5430.25,
            transactions: [
              { id: 'T011', date: '2024-03-15', description: 'Home Depot', amount: -75.50, type: 'debit' },
              { id: 'T012', date: '2024-03-14', description: 'Tax Refund', amount: 2900.00, type: 'credit' }
            ]
          },
          {
            id: 'CUST003',
            name: 'Rishi',
            email: 'rishi@example.com',
            phone: '(555) 789-0123',
            address: '456 Oak Ave, Somewhere, NY 10001',
            accountNumber: '**** **** **** 7890',
            accountType: 'Checking',
            balance: 1876.50,
            transactions: [
              { id: 'T021', date: '2024-03-15', description: 'Lowe\'s Home Improvement', amount: -95.75, type: 'debit' },
              { id: 'T022', date: '2024-03-14', description: 'Freelance Payment', amount: 1500.00, type: 'credit' }
            ]
          }
        ];

        await db.customers.bulkAdd(sampleCustomers);
        console.log('Sample customers added to database');
      }

      // Add sample dispute cases if needed
      if (disputeCount === 0) {
        console.log('Adding sample dispute cases...');
        const sampleDisputeCases: DisputeCase[] = [
          {
            id: 'DISP-003',
            customerName: 'John Smith',
            status: 'pending',
            type: 'Service Not Received',
            amount: 125.50,
            date: '2024-03-14',
            priority: 'medium'
          },
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
          }
        ];

        await db.disputeCases.bulkAdd(sampleDisputeCases);
        console.log('Sample dispute cases added to database');
      }
      
      // Verify data was added
      const finalDisputeCount = await db.disputeCases.count();
      const finalCustomerCount = await db.customers.count();
      console.log('Final database state - Disputes:', finalDisputeCount, 'Customers:', finalCustomerCount);
      
    } catch (error) {
      console.error('Error initializing database with sample data:', error);
    }
  },

  // Add a function to manually add a customer
  addCustomer: async (customer: CustomerContext) => {
    try {
      await db.customers.put(customer);
      console.log('Customer added to database:', customer);
      return true;
    } catch (error) {
      console.error('Error adding customer:', error);
      return false;
    }
  }
}; 