# Agentic Claims - Automated Dispute Resolution System

> Author: Rishijeet

A modern web application that provides an AI-powered chatbot interface for automated dispute resolution. The system uses local AI models to dynamically collect information about merchant communication, PIN usage, and transaction details to set up claims without human intervention.

## Overview

Agentic Claims is designed to streamline the dispute resolution process by:
- Providing a conversational interface for users to submit disputes
- Using AI to guide users through the information collection process
- Automatically gathering and organizing dispute-related information
- Offering a modern, enterprise-grade user interface
- Running completely locally with no external API dependencies

## Features

- 🤖 AI-powered dispute resolution using local models
- 💬 Real-time chat interface with instant responses
- 🎨 Modern Material-UI design with enterprise-grade styling
- 🔄 WebSocket-based communication for seamless interaction
- 📱 Responsive design that works on all devices
- 🔒 Local processing with no external API dependencies

## Technology Stack

- **Frontend**: React with TypeScript and Material-UI
- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **AI Integration**: Ollama with Mistral model
- **Database**: MongoDB (for future use)

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```

2. Install and start Ollama:
   ```bash
   brew install ollama
   brew services start ollama
   ollama pull mistral
   ```

3. Start the application:
   ```bash
   npm run dev:full
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Architecture

The application follows a modern microservices architecture:
- Frontend React application serving the user interface
- Backend Express server handling business logic
- WebSocket server managing real-time communication
- Local AI model processing through Ollama
- MongoDB database for data persistence (planned)

## Security

- All processing happens locally
- No external API dependencies
- Secure WebSocket connections
- Input validation on both frontend and backend
- Environment-based configuration

## License

MIT 