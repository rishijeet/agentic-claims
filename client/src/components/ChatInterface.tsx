/**
 * @author Rishijeet
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Send as SendIcon, 
  Person as PersonIcon, 
  SmartToy as BotIcon 
} from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
}

interface CustomerContext {
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

interface ChatInterfaceProps {
  customerContext?: CustomerContext;
  messages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  customerContext, 
  messages: externalMessages, 
  onMessagesChange 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextAddedRef = useRef<boolean>(false);

  // Initialize messages with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: 'Hello! I\'m your dispute resolution assistant. How can I help you today?',
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Add customer context message when customer is selected
  useEffect(() => {
    if (customerContext && !contextAddedRef.current) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `Welcome Agent! I see you're working with ${customerContext.name}'s case.`,
        sender: 'agent',
        timestamp: new Date()
      };
      
      const contextMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Customer Profile:\n• Name: ${customerContext.name}\n• Account Number: ${customerContext.accountNumber}\n• Account Type: ${customerContext.accountType}\n• Current Balance: $${customerContext.balance.toFixed(2)}\n• Email: ${customerContext.email}\n• Phone: ${customerContext.phone}\n• Address: ${customerContext.address}\n\nRecent Transactions:\n${customerContext.transactions.slice(0, 5).map((t: Transaction) => 
          `• ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${t.amount.toFixed(2)} (${t.type})`
        ).join('\n')}\n\nI've identified the following potential dispute candidates based on recent activity:\n${customerContext.transactions
          .filter((t: Transaction) => t.type === 'debit' && t.amount > 100)
          .map((t: Transaction) => 
            `• ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${t.amount.toFixed(2)}`
          ).join('\n')}\n\nWould you like to:\n1. Review any of these transactions in detail?\n2. Start a new dispute for a specific transaction?\n3. View the customer's complete transaction history?\n\nPlease let me know how I can assist you.`,
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage, contextMessage]);
      contextAddedRef.current = true;
    }
  }, [customerContext]);

  // Reset context when customer changes
  useEffect(() => {
    if (customerContext) {
      contextAddedRef.current = false;
    }
  }, [customerContext?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAgentResponse(inputText, customerContext),
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAgentResponse = (userMessage: string, customer: CustomerContext | undefined): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // If we have customer context, provide more personalized responses
    if (customer) {
      if (lowerMessage.includes('transaction') || lowerMessage.includes('purchase')) {
        return `Here are ${customer.name}'s recent transactions:\n${customer.transactions.slice(0, 5).map((t: Transaction) => 
          `• ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${t.amount.toFixed(2)} (${t.type})`
        ).join('\n')}\n\nI've highlighted transactions over $100 as potential dispute candidates. Would you like to:\n1. Review any specific transaction?\n2. Start a dispute for one of these transactions?\n3. See more transaction history?`;
      } else if (lowerMessage.includes('balance') || lowerMessage.includes('account')) {
        return `${customer.name}'s current balance is $${customer.balance.toFixed(2)}. Their account type is ${customer.accountType}. Is there something specific about their account you'd like to know?`;
      } else if (lowerMessage.includes('dispute') || lowerMessage.includes('charge')) {
        return `I can help you file a dispute for ${customer.name}. Based on their recent transactions, here are the potential dispute candidates:\n${customer.transactions
          .filter((t: Transaction) => t.type === 'debit' && t.amount > 100)
          .map((t: Transaction) => 
            `• ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${t.amount.toFixed(2)}`
          ).join('\n')}\n\nPlease select a transaction to dispute, and I'll guide you through the process.`;
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('merchant')) {
        return `I can see ${customer.name}'s contact information:\n• Email: ${customer.email}\n• Phone: ${customer.phone}\n\nWould you like me to help you draft a message to the merchant?`;
      } else if (lowerMessage.includes('yes') || lowerMessage.includes('2') || lowerMessage.includes('start a dispute')) {
        return `Great! Let's start a dispute for ${customer.name}. Please select one of these transactions:\n${customer.transactions.map((t: Transaction, index: number) => 
          `${index + 1}. ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${t.amount.toFixed(2)} (${t.type})`
        ).join('\n')}\n\nJust type the number of the transaction you want to dispute.`;
      } else if (/^\d+$/.test(lowerMessage.trim()) && !lowerMessage.includes('$') && parseInt(lowerMessage.trim()) <= customer.transactions.length) {
        // If the message is just a number and it's a valid transaction index, assume it's a transaction selection
        const index = parseInt(lowerMessage.trim()) - 1;
        if (index >= 0 && index < customer.transactions.length) {
          const transaction = customer.transactions[index];
          return `You've selected this transaction for dispute:\n• Date: ${new Date(transaction.date).toLocaleDateString()}\n• Description: ${transaction.description}\n• Amount: $${transaction.amount.toFixed(2)}\n• Type: ${transaction.type}\n\nPlease provide the reason for the dispute (e.g., unauthorized charge, incorrect amount, service not received).`;
        }
      } else if (lowerMessage.includes('incorrect amount') || lowerMessage.includes('wrong amount') || lowerMessage.includes('overcharged')) {
        return `I understand that the amount charged is incorrect. To proceed with the dispute, I need a few more details:\n\n1. What was the correct amount that should have been charged?\n2. Do you have any documentation (receipt, invoice) showing the correct amount?\n3. Have you contacted the merchant about this issue?\n\nPlease provide these details so I can help file your dispute.`;
      } else if (lowerMessage.includes('unauthorized') || lowerMessage.includes('didn\'t make') || lowerMessage.includes('didn\'t authorize')) {
        return `I understand this was an unauthorized charge. To proceed with the dispute, I need a few more details:\n\n1. When did you first notice this charge?\n2. Do you recognize the merchant?\n3. Have you contacted the merchant about this charge?\n\nPlease provide these details so I can help file your dispute.`;
      } else if (lowerMessage.includes('service') || lowerMessage.includes('not received') || lowerMessage.includes('didn\'t receive')) {
        return `I understand you didn't receive the service you paid for. To proceed with the dispute, I need a few more details:\n\n1. What service were you expecting to receive?\n2. Have you contacted the merchant about this issue?\n3. Do you have any documentation of your attempts to resolve this with the merchant?\n\nPlease provide these details so I can help file your dispute.`;
      } else if (/^\d+$/.test(lowerMessage.trim()) || lowerMessage.includes('$')) {
        // Handle dollar amount responses
        const amount = parseFloat(lowerMessage.replace(/[^0-9.]/g, ''));
        if (!isNaN(amount)) {
          return `Thank you for providing the correct amount of $${amount.toFixed(2)}. Now, please let me know:\n\n1. Do you have any documentation (receipt, invoice) showing this correct amount?\n2. Have you contacted the merchant about this issue?\n\nPlease provide these details to help us process your dispute.`;
        }
      } else if (lowerMessage.includes('visa') || lowerMessage.includes('receipt') || lowerMessage.includes('invoice') || lowerMessage.includes('documentation')) {
        return `Thank you for providing documentation. Now, please let me know:\n\n1. Have you contacted the merchant about this issue?\n2. If yes, what was their response?\n3. If no, would you like me to help you draft a message to the merchant?\n\nThis information will help us process your dispute more effectively.`;
      } else if (lowerMessage.includes('review') || lowerMessage.includes('1')) {
        return `Here are ${customer.name}'s recent transactions in detail:\n${customer.transactions.map((t: Transaction, index: number) => 
          `${index + 1}. ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${t.amount.toFixed(2)} (${t.type})`
        ).join('\n')}\n\nWhich transaction would you like to review in more detail?`;
      } else if (lowerMessage.includes('history') || lowerMessage.includes('3')) {
        return `Here's ${customer.name}'s complete transaction history:\n${customer.transactions.map((t: Transaction) => 
          `• ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${t.amount.toFixed(2)} (${t.type})`
        ).join('\n')}\n\nIs there a specific transaction you'd like to focus on?`;
      }
    }
    
    // Generic responses if no customer context or no specific keywords
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you with your dispute today?';
    } else if (lowerMessage.includes('dispute') || lowerMessage.includes('charge')) {
      return 'I can help you file a dispute. To proceed, I\'ll need to know which transaction you\'re disputing and the reason for the dispute.';
    } else if (lowerMessage.includes('time') || lowerMessage.includes('long')) {
      return 'The dispute resolution process typically takes 10-14 business days. We\'ll keep you updated on the progress.';
    } else if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else {
      return "I understand you're having an issue with your debit card. Could you provide more details about the transaction you're disputing?";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        <List>
          {messages.map((message) => (
            <ListItem 
              key={message.id} 
              alignItems="flex-start"
              sx={{ 
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                '& .MuiListItemAvatar-root': {
                  minWidth: message.sender === 'user' ? '40px' : 'auto',
                }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main' }}>
                  {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                </Avatar>
              </ListItemAvatar>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  maxWidth: '70%',
                  ml: message.sender === 'user' ? 0 : 2,
                  mr: message.sender === 'user' ? 2 : 0,
                  bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <ListItemText 
                  primary={message.text} 
                  secondary={formatTime(message.timestamp)}
                  secondaryTypographyProps={{ 
                    sx: { 
                      color: message.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                      fontSize: '0.7rem',
                      textAlign: message.sender === 'user' ? 'right' : 'left'
                    } 
                  }}
                />
              </Paper>
            </ListItem>
          ))}
          {isTyping && (
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <BotIcon />
                </Avatar>
              </ListItemAvatar>
              <Paper elevation={1} sx={{ p: 2, maxWidth: '70%', ml: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  <Typography variant="body2">Agent is typing...</Typography>
                </Box>
              </Paper>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      
      <Divider />
      
      <Box sx={{ display: 'flex', p: 2, pt: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          sx={{ mr: 1 }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={inputText.trim() === ''}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface; 