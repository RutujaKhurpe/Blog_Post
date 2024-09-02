// utils/jwt.js
const jwt = require('jsonwebtoken');
// Define the secret key
const JWT_SECRET_KEY = 'JWT_secretKey';

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET_KEY, {
        expiresIn: '1h',
    });
};
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        console.log("Token verified, decoded payload:", decoded);
        return decoded;
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return null;
    }
};

module.exports = { generateToken, verifyToken };
