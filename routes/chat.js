const router = require("express").Router();

// Middleware
const verifyUser = require("../middlewares/verifyUser");

// Controllers
const {
  sendMessage,
  getChatHistory,
  getConversations,
  markAsRead,
  deleteMessage
} = require("../controllers/chat");

// Apply authentication middleware to all routes
router.use(verifyUser);

// Chat routes
router.post('/send', sendMessage);
router.get('/history/:userId', getChatHistory);
router.get('/conversations', getConversations);
router.put('/mark-read/:userId', markAsRead);
router.delete('/message/:messageId', deleteMessage);

module.exports = router;
