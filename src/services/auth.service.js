import userRepo from "../repositories/user.repo.js";
import refreshTokenRepo from "../repositories/refreshToken.repo.js";

import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateToken  } from "../utils/jwt.js";
import { generateRefreshToken, hashToken } from "../utils/token.js";

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days


const register = async (userData) => {
    const { email, password } = userData;

    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
        const err = new Error("User already exists");
        err.status = 409;
        throw err;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userRepo.createUser({
        email,
        password: hashedPassword,
    });

    return {
        id: newUser.id,
        email: newUser.email,
    };
};

const login = async (userData) => {
    const { email, password } = userData;

    const user = await userRepo.findUserByEmail(email);
    if (!user) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }


    const token = generateToken({
        userId: user.id,
        email: user.email,
    }); 


    const refreshToken = generateRefreshToken();

    await refreshTokenRepo.create({
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    });

    return { token, refreshToken };
};


const refresh = async (refreshToken) => {
    const tokenHash = hashToken(refreshToken);

    const stored = await refreshTokenRepo.findValid(tokenHash);
    if (!stored) {
        const err = new Error("Invalid or expired refresh token");
        err.status = 401;
        throw err;
    }

    await refreshTokenRepo.revoke(stored.id);


    const accessToken = generateToken({
        userId: stored.userId,
    });

    const newRefreshToken = generateToken();

    await refreshTokenRepo.create({
        userId: stored.userId,
        tokenHash: hashToken(newRefreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    });

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};


const logout = async (refreshToken) => {
    if (!refreshToken) return true;
    await refreshTokenRepo.revokeByHash(hashToken(refreshToken));
    return true;
};

export default { register, login, refresh, logout};
