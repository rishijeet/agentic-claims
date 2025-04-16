/**
 * @author Rishijeet
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Avatar,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { io, Socket } from 'socket.io-client';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InfoIcon from '@mui/icons-material/Info';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5050');
    setSocket(newSocket);

    newSocket.on('botResponse', (response: string) => {
      setMessages(prev => [...prev, {
        text: response,
        sender: 'bot',
        timestamp: new Date()
      }]);
      setIsLoading(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartDispute = () => {
    if (socket) {
      setIsLoading(true);
      socket.emit('startDispute');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    const newMessage: Message = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    socket.emit('userMessage', { message: inputMessage });
    setInputMessage('');
    setIsLoading(true);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
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
        <Typography variant="h6" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon color="primary" />
          Dispute Resolution Assistant
        </Typography>
        <Tooltip title="AI-powered assistant to help resolve your disputes">
          <IconButton size="small">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <List sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            sx={{
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              padding: 0,
              gap: 1
            }}
          >
            {message.sender === 'bot' && (
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <SmartToyIcon />
              </Avatar>
            )}
            <Box sx={{ maxWidth: '70%' }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  position: 'relative'
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.text}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    position: 'absolute',
                    bottom: -20,
                    right: message.sender === 'user' ? 0 : 'auto',
                    color: 'text.secondary'
                  }}
                >
                  {formatTimestamp(message.timestamp)}
                </Typography>
              </Paper>
            </Box>
            {message.sender === 'user' && (
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <PersonIcon />
              </Avatar>
            )}
          </ListItem>
        ))}
        {isLoading && (
          <ListItem sx={{ justifyContent: 'center' }}>
            <CircularProgress size={24} />
          </ListItem>
        )}
        <div ref={messagesEndRef} />
      </List>

      <Divider />

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        {messages.length === 0 ? (
          <Button
            variant="contained"
            fullWidth
            onClick={handleStartDispute}
            disabled={isLoading}
            size="large"
            startIcon={<SmartToyIcon />}
          >
            Start New Dispute
          </Button>
        ) : (
          <form onSubmit={handleSendMessage}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !inputMessage.trim()}
                sx={{ minWidth: 100 }}
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default ChatInterface; 