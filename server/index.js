/**
 * @author Rishijeet
 */

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store chat history for each session
const chatSessions = new Map();

// Function to call Ollama API
async function callOllama(messages) {
  try {
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: 'mistral', // or any other model you have pulled
      messages: messages,
      stream: false
    });
    return response.data.message.content;
  } catch (error) {
    console.error('Ollama API error:', error);
    throw error;
  }
}

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('startDispute', async (data) => {
    const sessionId = socket.id;
    chatSessions.set(sessionId, {
      messages: [],
      claimData: {
        merchantCommunication: null,
        pinUsage: null,
        transactionDetails: null
      }
    });

    try {
      const response = await callOllama([
        {
          role: "system",
          content: "You are a helpful dispute resolution assistant. Guide the customer through the dispute process by asking relevant questions about merchant communication and PIN usage."
        },
        {
          role: "user",
          content: "I want to start a dispute for my transaction."
        }
      ]);

      socket.emit('botResponse', response);
    } catch (error) {
      console.error('Error:', error);
      // Provide a fallback response when Ollama API is unavailable
      socket.emit('botResponse', "Hello! I'm here to help you with your dispute. To get started, could you please provide the following information:\n\n1. Transaction date and amount\n2. Merchant name\n3. Have you already contacted the merchant about this issue?");
    }
  });

  socket.on('userMessage', async (data) => {
    const sessionId = socket.id;
    const session = chatSessions.get(sessionId);
    
    if (!session) return;

    session.messages.push({ role: "user", content: data.message });

    try {
      const response = await callOllama([
        {
          role: "system",
          content: "You are a helpful dispute resolution assistant. Guide the customer through the dispute process by asking relevant questions about merchant communication and PIN usage."
        },
        ...session.messages
      ]);

      session.messages.push({ role: "assistant", content: response });
      socket.emit('botResponse', response);
    } catch (error) {
      console.error('Error:', error);
      // Provide a fallback response when Ollama API is unavailable
      const fallbackResponses = [
        "I understand. Could you please provide more details about your communication with the merchant?",
        "Thank you for that information. Have you used your PIN for this transaction?",
        "I'm processing your information. Could you confirm the exact date and time of the transaction?",
        "I'm here to help. Could you tell me if you've received any response from the merchant?",
        "Thank you for providing that information. I'm setting up your claim. Is there anything else you'd like to add?"
      ];
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      socket.emit('botResponse', randomResponse);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    chatSessions.delete(socket.id);
  });
});

const PORT = process.env.PORT || 5050;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 