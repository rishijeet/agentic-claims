/**
 * @author Rishijeet
 */

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
}

export interface CustomerContext {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  transactions: Transaction[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface DisputeCase {
  id: string;
  customerName: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  type: string;
  amount: number;
  date: string;
  priority: 'high' | 'medium' | 'low';
} 