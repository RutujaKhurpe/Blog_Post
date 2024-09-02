// utils/protect.js
const { verifyToken } = require('./utils/jwt');

const protect = (req, res, next) => {
    console.log("Authorization Header received:", req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1];
        console.log("Token extracted:", token);
        const decoded = verifyToken(token);
        
        if (decoded) {
            req.user = decoded;
            next();
        } else {
            return res.status(401).json({ message: "Invalid token" });
        }
    } else {
        return res.status(401).json({ message: "Authorization token required" });
    }
};

module.exports = protect;
