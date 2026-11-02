import mongoose from 'mongoose';
import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';

// GET /api/chats
// Get all chats for the logged-in user
export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            'participants.userId': req.user.id,
        })
            .populate('participants.userId', 'username email avatar isOnline lastSeen')
            .populate('latestMessage')
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            count: chats.length,
            data: chats,
        });
    } catch (error) {
        console.error('Get Chats Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
            error: error.message,
        });
    }
};

// POST /api/chats
// Create or retrieve a one-to-one chat
export const createChat = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const currentUserId = req.user.id;

        if (!recipientId || !mongoose.isValidObjectId(recipientId)) {
            return res.status(400).json({
                success: false,
                message: 'A valid recipient ID is required.',
            });
        }

        if (recipientId === currentUserId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot create a chat with yourself.',
            });
        }

        const recipient = await User.findById(recipientId).select('_id');

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found.',
            });
        }

        // Check if a one-to-one chat already exists
        const existingChat = await Chat.findOne({
            isGroupChat: false,
            'participants.userId': {
                $all: [currentUserId, recipientId],
            },
            participants: {
                $size: 2,
            },
        })
            .populate('participants.userId', 'username email avatar isOnline')
            .populate('latestMessage');

        if (existingChat) {
            return res.status(200).json({
                success: true,
                message: 'Chat already exists.',
                data: existingChat,
            });
        }

        const chat = await Chat.create({
            chatName: '',
            isGroupChat: false,
            participants: [
                { userId: currentUserId, role: 'member' },
                { userId: recipientId, role: 'member' },
            ],
            createdBy: currentUserId,
        });

        const populatedChat = await Chat.findById(chat._id)
            .populate('participants.userId', 'username email avatar isOnline');

        return res.status(201).json({
            success: true,
            message: 'Chat created successfully.',
            data: populatedChat,
        });
    } catch (error) {
        console.error('Create Chat Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// GET /api/chats/:chatId
// Get a specific chat
export const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat ID.',
            });
        }

        const chat = await Chat.findOne({
            _id: chatId,
            'participants.userId': req.user.id,
        })
            .populate('participants.userId', 'username email avatar isOnline lastSeen')
            .populate('latestMessage')
            .populate('pinnedMessages');

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found.',
            });
        }

        return res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        console.error('Get Chat Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// POST /api/chats/group
// Create a group chat
export const createGroupChat = async (req, res) => {
    try {
        const { chatName, participantIds } = req.body;
        const currentUserId = req.user.id;

        if (typeof chatName !== 'string' || !chatName.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Group name is required.',
            });
        }

        if (!Array.isArray(participantIds) || participantIds.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Provide at least two other participants.',
            });
        }

        if (participantIds.some((id) => !mongoose.isValidObjectId(id))) {
            return res.status(400).json({
                success: false,
                message: 'One or more participant IDs are invalid.',
            });
        }

        const allParticipantIds = [
            ...new Set([
                currentUserId.toString(),
                ...participantIds.map((id) => id.toString()),
            ]),
        ];

        const users = await User.find({
            _id: { $in: allParticipantIds },
        }).select('_id');

        if (users.length !== allParticipantIds.length) {
            return res.status(404).json({
                success: false,
                message: 'One or more participants were not found.',
            });
        }

        const participants = allParticipantIds.map((userId) => ({
            userId,
            role: userId === currentUserId.toString() ? 'admin' : 'member',
        }));

        const chat = await Chat.create({
            chatName: chatName.trim(),
            isGroupChat: true,
            participants,
            createdBy: currentUserId,
        });

        const populatedChat = await Chat.findById(chat._id)
            .populate('participants.userId', 'username email avatar isOnline');

        return res.status(201).json({
            success: true,
            message: 'Group created successfully.',
            data: populatedChat,
        });
    } catch (error) {
        console.error('Create Group Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// PUT /api/chats/group/:chatId
// Update group details
export const updateGroupChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { chatName } = req.body;

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid chat ID.',
            });
        }

        if (typeof chatName !== 'string' || !chatName.trim()) {
            return res.status(400).json({
                success: false,
                message: 'A valid group name is required.',
            });
        }

        const chat = await Chat.findOne({
            _id: chatId,
            isGroupChat: true,
            'participants.userId': req.user.id,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Group chat not found.',
            });
        }

        const currentParticipant = chat.participants.find(
            (participant) =>
                participant.userId.toString() === req.user.id.toString()
        );

        if (!currentParticipant || currentParticipant.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only group admins can update group details.',
            });
        }

        chat.chatName = chatName.trim();
        await chat.save();

        const updatedChat = await Chat.findById(chat._id)
            .populate('participants.userId', 'username email avatar isOnline');

        return res.status(200).json({
            success: true,
            message: 'Group updated successfully.',
            data: updatedChat,
        });
    } catch (error) {
        console.error('Update Group Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};