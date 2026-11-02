import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

import {
    getMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    markMessagesAsRead,
    toggleReaction,
    forwardMessage,
} from '../controllers/messageController.js';

const router = express.Router({ mergeParams: true });

// Message CRUD
router.get('/', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/:messageId',  protect, editMessage);
router.delete('/:messageId',  protect, deleteMessage);

// Read receipts
router.post('/read',  protect, markMessagesAsRead);

// Reactions
router.put('/:messageId/reactions',  protect, toggleReaction);

// Forward message
router.post('/:messageId/forward',  protect, forwardMessage);

export default router;