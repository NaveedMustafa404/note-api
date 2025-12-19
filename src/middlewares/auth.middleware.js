import {verifyToken} from "../utils/jwt.js";

export const isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {    
            return res.status(401).json({ success : false, message : "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        req.user = { id: decoded.userId, email: decoded.email }; 
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or token expired" });
    }
};

