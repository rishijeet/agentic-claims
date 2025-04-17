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

interface ChatInterfaceProps {
  customerContext?: any;
  messages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  customerContext, 
  messages: externalMessages, 
  onMessagesChange 
}) => {
  const [internalMessages, setInternalMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your dispute resolution assistant. How can I help you today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  
  const messages = externalMessages || internalMessages;
  const setMessages = onMessagesChange || setInternalMessages;
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextAddedRef = useRef<boolean>(false);

  // Add initial context message if customer is selected
  useEffect(() => {
    if (customerContext && !contextAddedRef.current) {
      const contextMessage: Message = {
        id: Date.now().toString(),
        text: `I see you're looking at ${customerContext.name}'s account. Their account number is ${customerContext.accountNumber} and they have a ${customerContext.accountType} account with a current balance of $${customerContext.balance.toFixed(2)}. How can I assist with their dispute?`,
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages([...messages, contextMessage]);
      contextAddedRef.current = true;
    }
  }, [customerContext]);

  // Reset the context added flag when customer context changes
  useEffect(() => {
    if (customerContext) {
      contextAddedRef.current = false;
    } else {
      contextAddedRef.current = true;
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

    setMessages([...messages, newMessage]);
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

      setMessages([...messages, newMessage, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAgentResponse = (userMessage: string, customer: any): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // If we have customer context, provide more personalized responses
    if (customer) {
      if (lowerMessage.includes('transaction') || lowerMessage.includes('purchase')) {
        return `I can see ${customer.name} has several recent transactions. Would you like me to review any specific transaction or help with a dispute related to one of their purchases?`;
      } else if (lowerMessage.includes('balance') || lowerMessage.includes('account')) {
        return `${customer.name}'s current balance is $${customer.balance.toFixed(2)}. Is there something specific about their account you'd like to know?`;
      } else if (lowerMessage.includes('dispute') || lowerMessage.includes('charge')) {
        return `I can help you file a dispute for ${customer.name}. To proceed, I'll need to know which transaction you're disputing and the reason for the dispute.`;
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