import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async(password) => {
    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password , saltRounds);
        return hashedPassword;
    }
    catch(error){
        console.log("Something went Wrong")
    }
}

export const comparePassword = async(password,hashedPassword) => {
    return bcrypt.compare(password , hashedPassword);
}

export const generateToken = (userId) => {
    return jwt.sign(
        {
            id: userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
        }
    );
};
