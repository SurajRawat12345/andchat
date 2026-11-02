import mongoose from 'mongoose';

// Attachment Schema
const attachmentSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },

        fileName: {
            type: String,
            default: '',
        },

        fileType: {
            type: String,
            default: '',
        },

        fileSize: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

// Reaction Schema
const reactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        emoji: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Read Receipt Schema
const readBySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        readAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

// Message Schema
const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: true,
            index: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        content: {
            type: String,
            trim: true,
            default: '',
        },

        messageType: {
            type: String,
            enum: ['text', 'image', 'video', 'audio', 'file'],
            default: 'text',
        },

        attachments: {
            type: [attachmentSchema],
            default: [],
        },

        reactions: {
            type: [reactionSchema],
            default: [],
        },

        readBy: {
            type: [readBySchema],
            default: [],
        },

        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: null,
        },

        forwardedFrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: null,
        },

        isEdited: {
            type: Boolean,
            default: false,
        },

        isDeletedForEveryone: {
            type: Boolean,
            default: false,
        },

        deletedFor: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for fetching chat messages
messageSchema.index({ chatId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;