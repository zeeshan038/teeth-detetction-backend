// NPM Packages
const socketIO = require("socket.io");

// Models
const UserLogs = require("./models/UserLogs");
const StoryModel = require("./models/Story");
const Favorite = require("./models/Favorite");
const User = require("./models/User");
const ChatMessage = require("./models/ChatMessage");

// Scores

// Users
const users = {};

module.exports = (server) => {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("User connected with userId:", socket.handshake.query.userId);

    const userId = socket.handshake.query.userId;
    users[userId] = socket
    
    // Join user to their room for private messaging
    socket.join(userId);
    
    // Handle sending messages
    socket.on("sendMessage", async (data) => {
      try {
        const { receiverId, message, messageType = "text", fileUrl = "" } = data;
        const senderId = userId;

        // Validate receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
          socket.emit("error", { message: "Receiver not found" });
          return;
        }

        // Create conversation ID
        const conversationId = [senderId, receiverId].sort().join("_");

        const newMessage = new ChatMessage({
          sender: senderId,
          receiver: receiverId,
          message,
          messageType,
          fileUrl,
          conversationId
        });

        await newMessage.save();
        await newMessage.populate('sender', 'firstName lastName profileImage role');
        await newMessage.populate('receiver', 'firstName lastName profileImage role');

        // Send message to receiver if online
        if (users[receiverId]) {
          users[receiverId].emit("newMessage", {
            messageId: newMessage._id,
            sender: newMessage.sender,
            receiver: newMessage.receiver,
            message: newMessage.message,
            messageType: newMessage.messageType,
            fileUrl: newMessage.fileUrl,
            conversationId: newMessage.conversationId,
            createdAt: newMessage.createdAt,
            isRead: false
          });
        }

        // Confirm message sent to sender
        socket.emit("messageSent", {
          messageId: newMessage._id,
          conversationId: newMessage.conversationId,
          createdAt: newMessage.createdAt,
          status: "sent"
        });

      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle typing indicators
    socket.on("typing", (data) => {
      const { receiverId, isTyping } = data;
      if (users[receiverId]) {
        users[receiverId].emit("userTyping", {
          userId: userId,
          isTyping: isTyping
        });
      }
    });

    // Handle message read status
    socket.on("markAsRead", async (data) => {
      try {
        const { senderId } = data;
        const receiverId = userId;
        const conversationId = [senderId, receiverId].sort().join("_");

        // Mark messages as read
        await ChatMessage.updateMany(
          {
            conversationId,
            receiver: receiverId,
            sender: senderId,
            isRead: false
          },
          { isRead: true }
        );

        if (users[senderId]) {
          users[senderId].emit("messagesRead", {
            conversationId,
            readBy: receiverId
          });
        }

        socket.emit("messagesMarkedAsRead", { conversationId });

      } catch (error) {
        console.error("Error marking messages as read:", error);
        socket.emit("error", { message: "Failed to mark messages as read" });
      }
    });

    socket.on("getUserStatus", (data) => {
      const { userId: targetUserId } = data;
      const isOnline = !!users[targetUserId];
      socket.emit("userStatus", {
        userId: targetUserId,
        isOnline
      });
    });

    // Broadcast user online status to relevant users
    socket.broadcast.emit("userOnline", { userId });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
      socket.broadcast.emit("userOffline", { userId });
      delete users[userId];
    });
  });

  return io;
};
