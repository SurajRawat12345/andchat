import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member',
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

const chatSchema = new mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true,
            default: '',
        },

        isGroupChat: {
            type: Boolean,
            default: false,
        },

        participants: {
            type: [participantSchema],
            required: true,
            validate: {
                validator: function (participants) {
                    return this.isGroupChat
                        ? participants.length >= 2
                        : participants.length === 2;
                },
                message:
                    'Group chats require at least 2 participants, and one-to-one chats require exactly 2.',
            },
        },

        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: null,
        },

        pinnedMessages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
            },
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;