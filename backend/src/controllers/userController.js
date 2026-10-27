import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/userModel.js';
import { hashPassword, comparePassword, generateToken } from '../helpers/authHelper.js';

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, avatar, bio } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email and password are required.',
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists.',
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            avatar,
            bio,
        });

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
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

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        user.isOnline = true;
        user.lastSeen = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: 'Logout successful.',
        });
    } catch (error) {
        console.error('Logout Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required.',
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before saving to DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save hashed token and expiry
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        // Frontend reset URL
        // const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // TODO:
        // Send this URL to the user's email using Nodemailer/Brevo.
        // console.log('Reset URL:', resetUrl);

        return res.status(200).json({
            success: true,
            message: 'Password reset link has been generated.',
            resetToken, // Remove this in production after email integration
        });
    } catch (error) {
        console.error('Forgot Password Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required.',
            });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token.',
            });
        }

        user.password = await hashPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully.',
        });
    } catch (error) {
        console.error('Reset Password Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// Get current logged-in user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User profile fetched successfully.',
            data: user,
        });
    } catch (error) {
        console.error('Get Current User Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};

// Update current user's profile
export const updateProfile = async (req, res) => {
    try {
        const { username, bio, avatar } = req.body;

        const updates = {};

        if (username !== undefined) {
            if (typeof username !== 'string' || !username.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Username cannot be empty.',
                });
            }

            updates.username = username.trim();
        }

        if (bio !== undefined) {
            if (typeof bio !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Bio must be a string.',
                });
            }

            updates.bio = bio.trim();
        }

        if (avatar !== undefined) {
            if (typeof avatar !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Avatar must be a string.',
                });
            }

            updates.avatar = avatar.trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Provide at least one field to update.',
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: user,
        });
    } catch (error) {
        console.error('Update Profile Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
        });
    }
};