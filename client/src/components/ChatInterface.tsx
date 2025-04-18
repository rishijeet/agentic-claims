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
  CircularProgress,
  IconButton
} from '@mui/material';
import { 
  Send as SendIcon, 
  Person as PersonIcon, 
  SmartToy as BotIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Message, CustomerContext, Transaction, DisputeCase } from '../types';

interface ChatInterfaceProps {
  customerContext?: CustomerContext;
  messages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
  agentName?: string;
  onClose?: () => void;
  onCreateDispute?: (dispute: {
    id: string;
    customerName: string;
    status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
    type: string;
    amount: number;
    date: string;
    priority: 'high' | 'medium' | 'low';
  }) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  customerContext, 
  messages: externalMessages, 
  onMessagesChange,
  agentName = 'Agent',
  onClose,
  onCreateDispute
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [disputeReason, setDisputeReason] = useState<string | null>(null);
  const [disputeDetails, setDisputeDetails] = useState<{
    serviceExpected?: string;
    contactedMerchant?: boolean;
    merchantResponse?: string;
    hasDocumentation?: boolean;
    draftMessage?: string;
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextAddedRef = useRef<boolean>(false);

  // Initialize messages with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `Hello ${agentName}! I'm your dispute resolution assistant. How can I help you today?`,
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [agentName]);

  // Add customer context message when customer is selected
  useEffect(() => {
    if (customerContext && !contextAddedRef.current) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `Welcome ${agentName}! I see you're working with ${customerContext.name}'s case. How can I assist you today?`,
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      contextAddedRef.current = true;
    }
  }, [customerContext, agentName]);

  // Reset context when customer changes
  useEffect(() => {
    if (customerContext) {
      contextAddedRef.current = false;
      setSelectedTransaction(null);
      setDisputeReason(null);
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
        text: generateAgentResponse(inputText, customerContext, selectedTransaction, disputeReason),
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAgentResponse = (
    userMessage: string, 
    customer: CustomerContext | undefined,
    selectedTransaction: Transaction | null,
    disputeReason: string | null
  ): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // If we have customer context, provide more personalized responses
    if (customer) {
      // First, check if this is a transaction selection
      const exactMessage = userMessage.trim();
      if (!selectedTransaction) {  // Only try to select if no transaction is currently selected
        const transaction = customer.transactions.find(t => {
          const tDate = new Date(t.date).toLocaleDateString();
          const tDesc = t.description;
          const fullMatch = `${tDate} - ${tDesc}`;
          return fullMatch === exactMessage || 
                 (tDate === exactMessage.split(' - ')[0] && tDesc === exactMessage.split(' - ')[1]);
        });

        if (transaction) {
          setSelectedTransaction(transaction);
          return `I'll help you create a dispute for this transaction:\n• Date: ${new Date(transaction.date).toLocaleDateString()}\n• Description: ${transaction.description}\n• Amount: $${Math.abs(transaction.amount).toFixed(2)}\n• Type: ${transaction.type === 'debit' ? 'Debit' : 'Credit'}\n\nPlease provide the reason for the dispute (e.g., unauthorized charge, incorrect amount, service not received).`;
        }
      }

      if (lowerMessage.includes('profile') || lowerMessage.includes('details') || lowerMessage.includes('information')) {
        return `Here are ${customer.name}'s details:\n• Name: ${customer.name}\n• Account Number: ${customer.accountNumber}\n• Account Type: ${customer.accountType}\n• Current Balance: $${customer.balance.toFixed(2)}\n• Email: ${customer.email}\n• Phone: ${customer.phone}\n• Address: ${customer.address}\n\nRecent Transactions:\n${customer.transactions.slice(0, 5).map((t: Transaction) => 
          `• ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${Math.abs(t.amount).toFixed(2)} (${t.type === 'debit' ? 'Debit' : 'Credit'})`
        ).join('\n')}\n\nWould you like to:\n1. Review any specific transaction?\n2. Start a dispute for one of these transactions?\n3. See more transaction history?`;
      } else if (lowerMessage.includes('transaction') || lowerMessage.includes('purchase')) {
        const recentTransactions = customer.transactions.slice(0, 5);
        const transactionList = recentTransactions.map((t: Transaction) => 
          `• ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${Math.abs(t.amount).toFixed(2)} (${t.type === 'debit' ? 'Debit' : 'Credit'})`
        ).join('\n');
        
        const potentialDisputes = customer.transactions
          .filter((t: Transaction) => t.type === 'debit' && Math.abs(t.amount) > 100)
          .map((t: Transaction) => 
            `• ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${Math.abs(t.amount).toFixed(2)}`
          ).join('\n');

        return `Here are ${customer.name}'s recent transactions:\n${transactionList}\n\nPotential dispute candidates (transactions over $100):\n${potentialDisputes}\n\nWould you like to:\n1. Review any specific transaction?\n2. Start a dispute for one of these transactions?\n3. See more transaction history?`;
      } else if (lowerMessage.includes('balance') || lowerMessage.includes('account')) {
        return `${customer.name}'s current balance is $${customer.balance.toFixed(2)}. Their account type is ${customer.accountType}. Is there something specific about their account you'd like to know?`;
      } else if (lowerMessage.includes('dispute') || lowerMessage.includes('charge')) {
        const potentialDisputes = customer.transactions
          .filter((t: Transaction) => t.type === 'debit' && Math.abs(t.amount) > 100)
          .map((t: Transaction) => 
            `• ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${Math.abs(t.amount).toFixed(2)}`
          ).join('\n');

        return `I can help you file a dispute for ${customer.name}. Based on their recent transactions, here are the potential dispute candidates:\n${potentialDisputes}\n\nPlease select a transaction to dispute by typing its date and description (e.g., "11/03/2024 - Apple Store"), and I'll guide you through the process.`;
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('merchant')) {
        if (selectedTransaction) {
          return `I can help you draft a message to ${selectedTransaction.description}. Would you like me to create a professional message explaining the issue with your transaction? The message will include:\n\n` +
            `• Transaction details (date, amount)\n` +
            `• Your contact information\n` +
            `• A clear explanation of the issue\n\n` +
            `Would you like me to proceed with drafting the message?`;
        } else {
          return `I can see ${customer.name}'s contact information:\n• Email: ${customer.email}\n• Phone: ${customer.phone}\n\nWould you like me to help you draft a message to the merchant?`;
        }
      } else if (lowerMessage.includes('yes') && lowerMessage.includes('draft') || lowerMessage.includes('proceed')) {
        if (selectedTransaction) {
          const draftMessage = `Dear ${selectedTransaction.description} Support Team,\n\n` +
            `I am writing regarding a transaction on my account:\n\n` +
            `Transaction Details:\n` +
            `• Date: ${new Date(selectedTransaction.date).toLocaleDateString()}\n` +
            `• Amount: $${Math.abs(selectedTransaction.amount).toFixed(2)}\n` +
            `• Transaction ID: ${selectedTransaction.id}\n\n` +
            `Contact Information:\n` +
            `• Name: ${customer.name}\n` +
            `• Email: ${customer.email}\n` +
            `• Phone: ${customer.phone}\n\n` +
            `Issue Description:\n` +
            (disputeReason === 'unauthorized' ? `This charge was unauthorized and I did not make this purchase.` :
             disputeReason === 'incorrect_amount' ? `The amount charged is incorrect.` :
             disputeReason === 'service_not_received' ? `I did not receive the service I paid for.` :
             `I am disputing this transaction.`) +
            `\n\nI would appreciate your prompt attention to this matter. Please contact me at your earliest convenience to resolve this issue.\n\n` +
            `Best regards,\n` +
            `${customer.name}`;

          setDisputeDetails(prev => ({ ...prev, draftMessage }));
          
          return `I've drafted a message for you to send to ${selectedTransaction.description}:\n\n${draftMessage}\n\n` +
            `Would you like me to:\n` +
            `1. Modify this message\n` +
            `2. Send this message as is\n` +
            `3. Save this message for later\n\n` +
            `Please let me know how you'd like to proceed.`;
        }
      } else if (lowerMessage.includes('modify') || lowerMessage.includes('change')) {
        return `What would you like to modify in the message? You can:\n\n` +
          `1. Add more details about the issue\n` +
          `2. Change the tone or format\n` +
          `3. Add additional contact information\n` +
          `4. Include specific dates or times\n\n` +
          `Please let me know what changes you'd like to make.`;
      } else if (lowerMessage.includes('send') || lowerMessage.includes('2')) {
        if (!selectedTransaction) {
          return "I can't send a message because no transaction is selected. Please select a transaction first.";
        }
        
        return `I'll help you send this message to ${selectedTransaction.description}. Since this is a simulated environment, I'll confirm that the message has been sent:\n\n` +
          `✓ Message sent to ${selectedTransaction.description}\n` +
          `✓ Copy saved to your dispute file\n` +
          `✓ Merchant will be notified\n\n` +
          `Would you like me to help you with anything else regarding this dispute?`;
      } else if (lowerMessage.includes('save') || lowerMessage.includes('3')) {
        return `I've saved the message to your dispute file. You can access it later when needed.\n\n` +
          `Would you like to:\n` +
          `1. Continue with the dispute process\n` +
          `2. Review other transactions\n` +
          `3. End this session\n\n` +
          `Please let me know how you'd like to proceed.`;
      } else if (/^\d+$/.test(lowerMessage.trim()) && !lowerMessage.includes('$') && parseInt(lowerMessage.trim()) <= customer.transactions.length) {
        // If the message is just a number and it's a valid transaction index, assume it's a transaction selection
        const index = parseInt(lowerMessage.trim()) - 1;
        if (index >= 0 && index < customer.transactions.length) {
          const transaction = customer.transactions[index];
          setSelectedTransaction(transaction);
          return `You've selected this transaction for dispute:\n• Date: ${new Date(transaction.date).toLocaleDateString()}\n• Description: ${transaction.description}\n• Amount: $${Math.abs(transaction.amount).toFixed(2)}\n• Type: ${transaction.type === 'debit' ? 'Debit' : 'Credit'}\n\nPlease provide the reason for the dispute (e.g., unauthorized charge, incorrect amount, service not received).`;
        }
      } else if (lowerMessage.includes('create') && lowerMessage.includes('dispute')) {
        if (selectedTransaction && disputeReason) {
          // Generate a unique dispute ID
          const disputeId = `DISP-${Date.now().toString().slice(-3)}`;
          
          // Create the dispute case with explicit typing
          const priority: 'high' | 'medium' | 'low' = 
            Math.abs(selectedTransaction.amount) > 500 ? 'high' :
            Math.abs(selectedTransaction.amount) > 200 ? 'medium' : 'low';

          const disputeCase: DisputeCase = {
            id: disputeId,
            customerName: customer.name,
            status: 'pending',
            type: disputeReason === 'unauthorized' ? 'Unauthorized Transaction' :
                  disputeReason === 'incorrect_amount' ? 'Incorrect Amount' :
                  disputeReason === 'service_not_received' ? 'Service Not Received' :
                  'Transaction Dispute',
            amount: Math.abs(selectedTransaction.amount),
            date: new Date().toISOString().split('T')[0],
            priority
          };

          // Call the onCreateDispute callback
          onCreateDispute?.(disputeCase);

          return `I've created a new dispute case for you:\n\n` +
            `Dispute ID: ${disputeId}\n` +
            `Customer: ${customer.name}\n` +
            `Transaction: ${selectedTransaction.description}\n` +
            `Amount: $${Math.abs(selectedTransaction.amount).toFixed(2)}\n` +
            `Type: ${disputeCase.type}\n` +
            `Priority: ${disputeCase.priority}\n` +
            `Status: Pending\n\n` +
            `The dispute has been added to your recent cases. You can track its progress in the agent sidebar.\n\n` +
            `Would you like to:\n` +
            `1. Review the dispute details\n` +
            `2. Start a new dispute\n` +
            `3. End this session`;
        } else {
          return `To create a dispute, please first select a transaction and provide a reason for the dispute.`;
        }
      } else if (selectedTransaction) {
        if (lowerMessage.includes('unauthorized') || lowerMessage.includes('didn\'t make') || lowerMessage.includes('didn\'t authorize')) {
          setDisputeReason('unauthorized');
          return `I understand this was an unauthorized charge. To proceed with the dispute, I need a few more details:\n\n1. When did you first notice this charge?\n2. Do you recognize the merchant?\n3. Have you contacted the merchant about this charge?\n\nPlease provide these details so I can help file your dispute.`;
        } else if (lowerMessage.includes('incorrect amount') || lowerMessage.includes('wrong amount') || lowerMessage.includes('overcharged')) {
          setDisputeReason('incorrect_amount');
          return `I understand that the amount charged is incorrect. To proceed with the dispute, I need a few more details:\n\n1. What was the correct amount that should have been charged?\n2. Do you have any documentation (receipt, invoice) showing the correct amount?\n3. Have you contacted the merchant about this issue?\n\nPlease provide these details so I can help file your dispute.`;
        } else if (lowerMessage.includes('service') || lowerMessage.includes('not received') || lowerMessage.includes('didn\'t receive')) {
          setDisputeReason('service_not_received');
          return `I understand you didn't receive the service you paid for. To proceed with the dispute, I need a few more details:\n\n1. What service were you expecting to receive?\n2. Have you contacted the merchant about this issue?\n3. Do you have any documentation of your attempts to resolve this with the merchant?\n\nPlease provide these details so I can help file your dispute.`;
        } else if (disputeReason === 'service_not_received') {
          // Handle follow-up questions for service not received
          if (!disputeDetails.serviceExpected) {
            setDisputeDetails(prev => ({ ...prev, serviceExpected: userMessage }));
            return `Thank you for providing that information. Have you contacted the merchant about this issue? Please let me know if you have and what their response was.`;
          } else if (disputeDetails.serviceExpected && !disputeDetails.contactedMerchant) {
            const contacted = lowerMessage.includes('yes') || lowerMessage.includes('contacted');
            setDisputeDetails(prev => ({ 
              ...prev, 
              contactedMerchant: contacted,
              merchantResponse: contacted ? userMessage : undefined
            }));
            return `Do you have any documentation of your attempts to resolve this with the merchant? This could include emails, chat logs, or any other communication.`;
          } else if (disputeDetails.contactedMerchant && !disputeDetails.hasDocumentation) {
            const hasDocs = lowerMessage.includes('yes') || lowerMessage.includes('have') || lowerMessage.includes('documentation');
            setDisputeDetails(prev => ({ ...prev, hasDocumentation: hasDocs }));
            
            // Prepare dispute summary
            const summary = `I'll help you file a dispute for this transaction:\n\n` +
              `Transaction Details:\n` +
              `• Date: ${new Date(selectedTransaction.date).toLocaleDateString()}\n` +
              `• Description: ${selectedTransaction.description}\n` +
              `• Amount: $${Math.abs(selectedTransaction.amount).toFixed(2)}\n` +
              `• Type: ${selectedTransaction.type === 'debit' ? 'Debit' : 'Credit'}\n\n` +
              `Dispute Details:\n` +
              `• Reason: Service Not Received\n` +
              `• Expected Service: ${disputeDetails.serviceExpected}\n` +
              `• Contacted Merchant: ${disputeDetails.contactedMerchant ? 'Yes' : 'No'}\n` +
              (disputeDetails.merchantResponse ? `• Merchant Response: ${disputeDetails.merchantResponse}\n` : '') +
              `• Has Documentation: ${hasDocs ? 'Yes' : 'No'}\n\n` +
              `Would you like me to proceed with filing this dispute?`;
            
            return summary;
          }
        } else if (/^\d+$/.test(lowerMessage.trim()) || lowerMessage.includes('$')) {
          // Handle dollar amount responses
          const amount = parseFloat(lowerMessage.replace(/[^0-9.]/g, ''));
          if (!isNaN(amount)) {
            return `Thank you for providing the correct amount of $${amount.toFixed(2)}. Now, please let me know:\n\n1. Do you have any documentation (receipt, invoice) showing this correct amount?\n2. Have you contacted the merchant about this issue?\n\nPlease provide these details to help us process your dispute.`;
          }
        } else if (lowerMessage.includes('visa') || lowerMessage.includes('receipt') || lowerMessage.includes('invoice') || lowerMessage.includes('documentation')) {
          return `Thank you for providing documentation. Now, please let me know:\n\n1. Have you contacted the merchant about this issue?\n2. If yes, what was their response?\n3. If no, would you like me to help you draft a message to the merchant?\n\nThis information will help us process your dispute more effectively.`;
        } else {
          // Try to find a transaction by exact message match
          const exactMessage = userMessage.trim();
          const transaction = customer.transactions.find(t => {
            const tDate = new Date(t.date).toLocaleDateString();
            const tDesc = t.description;
            const fullMatch = `${tDate} - ${tDesc}`;
            return fullMatch === exactMessage || 
                   (tDate === exactMessage.split(' - ')[0] && tDesc === exactMessage.split(' - ')[1]);
          });

          if (transaction) {
            setSelectedTransaction(transaction);
            return `I'll help you create a dispute for this transaction:\n• Date: ${new Date(transaction.date).toLocaleDateString()}\n• Description: ${transaction.description}\n• Amount: $${Math.abs(transaction.amount).toFixed(2)}\n• Type: ${transaction.type === 'debit' ? 'Debit' : 'Credit'}\n\nPlease provide the reason for the dispute (e.g., unauthorized charge, incorrect amount, service not received).`;
          }
        }
      } else if (lowerMessage.includes('review') || lowerMessage.includes('1')) {
        return `Here are ${customer.name}'s recent transactions in detail:\n${customer.transactions.map((t: Transaction, index: number) => 
          `${index + 1}. ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${Math.abs(t.amount).toFixed(2)} (${t.type === 'debit' ? 'Debit' : 'Credit'})`
        ).join('\n')}\n\nWhich transaction would you like to review in more detail?`;
      } else if (lowerMessage.includes('history') || lowerMessage.includes('3')) {
        return `Here's ${customer.name}'s complete transaction history:\n${customer.transactions.map((t: Transaction) => 
          `• ${new Date(t.date).toLocaleDateString()} - ${t.description} - $${Math.abs(t.amount).toFixed(2)} (${t.type === 'debit' ? 'Debit' : 'Credit'})`
        ).join('\n')}\n\nIs there a specific transaction you'd like to focus on?`;
      } else {
        // Try to find a transaction by date and description in any message
        const transactionDate = lowerMessage.match(/\d{2}\/\d{2}\/\d{4}/)?.[0];
        const transactionDesc = lowerMessage.match(/- ([^-]+) -/)?.[1]?.trim();
        
        if (transactionDate && transactionDesc) {
          const transaction = customer.transactions.find(t => {
            const tDate = new Date(t.date).toLocaleDateString();
            return tDate === transactionDate && t.description.toLowerCase().includes(transactionDesc.toLowerCase());
          });
          
          if (transaction) {
            setSelectedTransaction(transaction);
            return `I'll help you create a dispute for this transaction:\n• Date: ${new Date(transaction.date).toLocaleDateString()}\n• Description: ${transaction.description}\n• Amount: $${Math.abs(transaction.amount).toFixed(2)}\n• Type: ${transaction.type === 'debit' ? 'Debit' : 'Credit'}\n\nPlease provide the reason for the dispute (e.g., unauthorized charge, incorrect amount, service not received).`;
          }
        }
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
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6">
          Chat with {customerContext ? customerContext.name : 'Customer'}
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>
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