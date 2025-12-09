require('dotenv').config();
const http = require('http');
const jwt = require('jsonwebtoken');
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  const server = http.createServer(app);

  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('🔗 Socket connected:', socket.id);

    socket.on('authenticate', (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = String(decoded.id);
        socket.userId = userId;

        const userSockets = onlineUsers.get(userId) || new Set();
        userSockets.add(socket.id);
        onlineUsers.set(userId, userSockets);

        console.log(`🔐 Socket ${socket.id} authenticated as ${userId}`);
      } catch (err) {
        socket.emit('unauthorized', { message: 'Invalid token' });
        console.log('❌ Socket authentication failed', err.message);
        // socket.disconnect();
      }
    });

    socket.on('disconnect', () => {
      const userId = socket.userId;
      if (userId && onlineUsers.has(userId)) {
        const sockSet = onlineUsers.get(userId);
        sockSet.delete(socket.id);
        if (sockSet.size === 0) onlineUsers.delete(userId);
      }
      console.log('❌ Socket disconnected:', socket.id);
    });

  });

  app.set('io', io);
  app.set('onlineUsers', onlineUsers);

  server.listen(PORT, () => {
    console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
  });
})();
