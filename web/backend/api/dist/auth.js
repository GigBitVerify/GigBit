import jwt from "jsonwebtoken";
import { env } from "./config.js";
export function signToken(userId) {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
}
export function requireAuth(req, res, next) {
    const header = req.header("authorization");
    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing Bearer token" });
        return;
    }
    const token = header.slice("Bearer ".length);
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        req.auth = { userId: payload.userId };
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid token" });
    }
}
