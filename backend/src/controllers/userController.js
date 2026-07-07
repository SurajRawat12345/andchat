import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, avatar, bio } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email and password are required.',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists.',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            avatar,
            bio,
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Register User Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};