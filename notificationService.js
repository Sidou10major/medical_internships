const Notification = require('./models/Notification');

/**
 * Creates a DB notification and emits it via Socket.IO in real-time.
 */
async function createAndEmitNotification(app, userId, title, body = "", meta = {}) {
  const notification = await Notification.create({
    user: userId,
    title,
    body,
    meta,
    read: false,
  });

  try {
    const io = app.get('io');
    const onlineUsers = app.get('onlineUsers');

    const sockets = onlineUsers.get(String(userId));

    if (sockets) {
      for (const socketId of sockets) {
        io.to(socketId).emit("notification", {
          id: notification._id,
          title,
          body,
          meta,
          createdAt: notification.createdAt,
        });
      }
    }
  } catch (err) {
    console.error("⚠ Error emitting real-time notification:", err.message);
  }

  return notification;
}

module.exports = { createAndEmitNotification };
