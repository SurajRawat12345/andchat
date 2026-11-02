import mongoose from 'mongoose';
import Message from '../models/messageModel.js';
import Chat from '../models/chatModel.js';

const isValidId = (id) => mongoose.isValidObjectId(id);

const findUserChat = async (chatId, userId) => {
    return Chat.findOne({
        _id: chatId,
        'participants.userId': userId,
    });
};

// GET /api/chats/:chatId/messages
// Get messages with pagination
export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 20)
        );

        if (!isValidId(chatId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat ID.',
            });
        }

        const chat = await findUserChat(chatId, req.user.id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found.',
            });
        }

        const filter = {
            chatId,
            deletedFor: { $ne: req.user.id },
        };

        const [messages, totalMessages] = await Promise.all([
            Message.find(filter)
                .populate('sender', 'username avatar')
                .populate({
                    path: 'replyTo',
                    populate: {
                        path: 'sender',
                        select: 'username avatar',
                    },
                })
                .populate('reactions.userId', 'username avatar')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),

            Message.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            data: messages.reverse(),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalMessages / limit),
                totalMessages,
                hasMore: page * limit < totalMessages,
            },
        });
    } catch (error) {
        console.error('Get Messages Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// POST /api/chats/:chatId/messages
// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const {
            content = '',
            messageType = 'text',
            attachments = [],
            replyTo,
        } = req.body;

        if (!isValidId(chatId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat ID.',
            });
        }

        const chat = await findUserChat(chatId, req.user.id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found.',
            });
        }

        const allowedTypes = ['text', 'image', 'video', 'audio', 'file'];

        if (!allowedTypes.includes(messageType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid message type.',
            });
        }

        if (
            (typeof content !== 'string') ||
            (attachments && !Array.isArray(attachments))
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid message content or attachments.',
            });
        }

        if (
            !content.trim() &&
            (!attachments || attachments.length === 0)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Message content or attachment is required.',
            });
        }

        // Validate reply message
        if (replyTo) {
            if (!isValidId(replyTo)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid reply message ID.',
                });
            }

            const originalMessage = await Message.findOne({
                _id: replyTo,
                chatId,
                isDeletedForEveryone: false,
            });

            if (!originalMessage) {
                return res.status(404).json({
                    success: false,
                    message: 'Reply message not found.',
                });
            }
        }

        const message = await Message.create({
            chatId,
            sender: req.user.id,
            content: content.trim(),
            messageType,
            attachments,
            replyTo: replyTo || null,
            readBy: [
                {
                    userId: req.user.id,
                    readAt: new Date(),
                },
            ],
        });

        // Update latest message in chat
        chat.latestMessage = message._id;
        await chat.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username avatar')
            .populate('replyTo');

        return res.status(201).json({
            success: true,
            message: 'Message sent successfully.',
            data: populatedMessage,
        });
    } catch (error) {
        console.error('Send Message Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// PUT /api/chats/:chatId/messages/:messageId
// Edit your own message
export const editMessage = async (req, res) => {
    try {
        const { chatId, messageId } = req.params;
        const { content } = req.body;

        if (!isValidId(chatId) || !isValidId(messageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat or message ID.',
            });
        }

        if (typeof content !== 'string' || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required.',
            });
        }

        const chat = await findUserChat(chatId, req.user.id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found.',
            });
        }

        const message = await Message.findOne({
            _id: messageId,
            chatId,
            sender: req.user.id,
            isDeletedForEveryone: false,
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found or you cannot edit it.',
            });
        }

        if (message.messageType !== 'text') {
            return res.status(400).json({
                success: false,
                message: 'Only text messages can be edited.',
            });
        }

        message.content = content.trim();
        message.isEdited = true;

        await message.save();

        return res.status(200).json({
            success: true,
            message: 'Message updated successfully.',
            data: message,
        });
    } catch (error) {
        console.error('Edit Message Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// DELETE /api/chats/:chatId/messages/:messageId
// Delete message for yourself or everyone
export const deleteMessage = async (req, res) => {
    try {
        const { chatId, messageId } = req.params;
        const { deleteForEveryone = false } = req.body;

        if (!isValidId(chatId) || !isValidId(messageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat or message ID.',
            });
        }

        const chat = await findUserChat(chatId, req.user.id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found.',
            });
        }

        const message = await Message.findOne({
            _id: messageId,
            chatId,
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found.',
            });
        }

        if (deleteForEveryone) {
            if (message.sender.toString() !== req.user.id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Only the sender can delete this message for everyone.',
                });
            }

            message.isDeletedForEveryone = true;
            message.content = '';
            message.attachments = [];
            message.reactions = [];

            await message.save();
        } else {
            await Message.updateOne(
                { _id: messageId },
                { $addToSet: { deletedFor: req.user.id } }
            );
        }

        return res.status(200).json({
            success: true,
            message: deleteForEveryone
                ? 'Message deleted for everyone.'
                : 'Message deleted for you.',
        });
    } catch (error) {
        console.error('Delete Message Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// POST /api/chats/:chatId/messages/read
// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!isValidId(chatId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat ID.',
            });
        }

        const chat = await findUserChat(chatId, req.user.id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found.',
            });
        }

        await Message.updateMany(
            {
                chatId,
                sender: { $ne: req.user.id },
                'readBy.userId': { $ne: req.user.id },
                deletedFor: { $ne: req.user.id },
                isDeletedForEveryone: false,
            },
            {
                $push: {
                    readBy: {
                        userId: req.user.id,
                        readAt: new Date(),
                    },
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Messages marked as read.',
        });
    } catch (error) {
        console.error('Mark Messages Read Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// PUT /api/chats/:chatId/messages/:messageId/reactions
// Add or remove a reaction
export const toggleReaction = async (req, res) => {
    try {
        const { chatId, messageId } = req.params;
        const { emoji } = req.body;

        if (!isValidId(chatId) || !isValidId(messageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat or message ID.',
            });
        }

        if (typeof emoji !== 'string' || !emoji.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Emoji is required.',
            });
        }

        const chat = await findUserChat(chatId, req.user.id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found.',
            });
        }

        const message = await Message.findOne({
            _id: messageId,
            chatId,
            isDeletedForEveryone: false,
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found.',
            });
        }

        const existingReaction = message.reactions.find(
            (reaction) =>
                reaction.userId.toString() === req.user.id.toString()
        );

        if (existingReaction) {
            if (existingReaction.emoji === emoji.trim()) {
                message.reactions = message.reactions.filter(
                    (reaction) =>
                        reaction.userId.toString() !== req.user.id.toString()
                );
            } else {
                existingReaction.emoji = emoji.trim();
            }
        } else {
            message.reactions.push({
                userId: req.user.id,
                emoji: emoji.trim(),
            });
        }

        await message.save();

        return res.status(200).json({
            success: true,
            message: 'Reaction updated successfully.',
            data: message.reactions,
        });
    } catch (error) {
        console.error('Toggle Reaction Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// POST /api/chats/:chatId/messages/:messageId/forward
// Forward message to another chat
export const forwardMessage = async (req, res) => {
    try {
        const { chatId, messageId } = req.params;
        const { targetChatId } = req.body;

        if (
            !isValidId(chatId) ||
            !isValidId(messageId) ||
            !isValidId(targetChatId)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat or message ID.',
            });
        }

        const [sourceChat, targetChat] = await Promise.all([
            findUserChat(chatId, req.user.id),
            findUserChat(targetChatId, req.user.id),
        ]);

        if (!sourceChat || !targetChat) {
            return res.status(404).json({
                success: false,
                message: 'Source or target chat not found.',
            });
        }

        const originalMessage = await Message.findOne({
            _id: messageId,
            chatId,
            isDeletedForEveryone: false,
        });

        if (!originalMessage) {
            return res.status(404).json({
                success: false,
                message: 'Original message not found.',
            });
        }

        const forwardedMessage = await Message.create({
            chatId: targetChatId,
            sender: req.user.id,
            content: originalMessage.content,
            messageType: originalMessage.messageType,
            attachments: originalMessage.attachments,
            forwardedFrom: originalMessage._id,
            readBy: [
                {
                    userId: req.user.id,
                    readAt: new Date(),
                },
            ],
        });

        targetChat.latestMessage = forwardedMessage._id;
        await targetChat.save();

        return res.status(201).json({
            success: true,
            message: 'Message forwarded successfully.',
            data: forwardedMessage,
        });
    } catch (error) {
        console.error('Forward Message Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};