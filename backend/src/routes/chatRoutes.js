import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
    getChats,
    createChat,
    getChatById,
    createGroupChat,
    updateGroupChat,
} from '../controllers/chatController.js';

const router = express.Router();

router.get('/', protect, getChats);
router.post('/', protect, createChat);
router.get('/:chatId', protect, getChatById);
router.post('/group', protect, createGroupChat);
router.put('/group/:chatId', protect, updateGroupChat);

export default router;