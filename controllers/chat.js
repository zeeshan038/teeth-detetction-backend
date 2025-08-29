const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");

/**
 * @description Send a new message
 * @route POST /api/chat/send
 * @access Private
 */
module.exports.sendMessage = async (req, res) => {
  const { receiverId, message, messageType = "text", fileUrl = "" } = req.body;
  const senderId = req.user._id;
  try {
    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        status: false,
        message: "Receiver not found"
      });
    }

    // Create conversation ID (consistent ordering)
    const conversationId = [senderId, receiverId].sort().join("_");

    // Create new message
    const newMessage = new ChatMessage({
      sender: senderId,
      receiver: receiverId,
      message,
      messageType,
      fileUrl,
      conversationId
    });

    await newMessage.save();

    // Populate sender info for response
    await newMessage.populate('sender', 'firstName lastName profileImage role');
    await newMessage.populate('receiver', 'firstName lastName profileImage role');

    return res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: newMessage
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error sending message",
      error: error.message
    });
  }
};

/**
 * @description Get chat history between two users
 * @route GET /api/chat/history/:userId
 * @access Private
 */
module.exports.getChatHistory = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;
  const { page = 1, limit = 50 } = req.query;
  try {
    const conversationId = [currentUserId, userId].sort().join("_");
    // Get messages with pagination
    const messages = await ChatMessage.find({
      conversationId,
      isDeleted: false
    })
    .populate('sender', 'firstName lastName profileImage role')
    .populate('receiver', 'firstName lastName profileImage role')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Mark messages as read
    await ChatMessage.updateMany(
      {
        conversationId,
        receiver: currentUserId,
        isRead: false
      },
      { isRead: true }
    );

    return res.status(200).json({
      status: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error fetching chat history",
      error: error.message
    });
  }
};

/**
 * @description Get all conversations for a user
 * @route GET /api/chat/conversations
 * @access Private
 */
module.exports.getConversations = async (req, res) => {
  const userId = req.user._id;
  try {
    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
          isDeleted: false
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiver", userId] }, { $eq: ["$isRead", false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "lastMessage.sender",
          foreignField: "_id",
          as: "senderInfo"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "lastMessage.receiver",
          foreignField: "_id",
          as: "receiverInfo"
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);

    // Format response
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.senderInfo[0]._id.toString() === userId.toString() 
        ? conv.receiverInfo[0] 
        : conv.senderInfo[0];

      return {
        conversationId: conv._id,
        otherUser: {
          _id: otherUser._id,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          profileImage: otherUser.profileImage,
          role: otherUser.role
        },
        lastMessage: {
          message: conv.lastMessage.message,
          createdAt: conv.lastMessage.createdAt,
          messageType: conv.lastMessage.messageType
        },
        unreadCount: conv.unreadCount
      };
    });

    return res.status(200).json({
      status: true,
      data: formattedConversations
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error fetching conversations",
      error: error.message
    });
  }
};

/**
 * @description Mark messages as read
 * @route PUT /api/chat/mark-read/:userId
 * @access Private
 */
module.exports.markAsRead = async (req, res) => {
  const { userId } = req.params;
  const {_id : currentUserId} = req.user;
  try {
    const conversationId = [currentUserId, userId].sort().join("_");

    await ChatMessage.updateMany(
      {
        conversationId,
        receiver: currentUserId,
        isRead: false
      },
      { isRead: true }
    );

    return res.status(200).json({
      status: true,
      message: "Messages marked as read"
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error marking messages as read",
      error: error.message
    });
  }
};

/**
 * @description Delete a message
 * @route DELETE /api/chat/message/:messageId
 * @access Private
 */
module.exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await ChatMessage.findOne({
      _id: messageId,
      sender: userId
    });

    if (!message) {
      return res.status(404).json({
        status: false,
        message: "Message not found or unauthorized"
      });
    }

    message.isDeleted = true;
    await message.save();

    return res.status(200).json({
      status: true,
      message: "Message deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting message",
      error: error.message
    });
  }
};
