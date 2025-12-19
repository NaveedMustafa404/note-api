import {generateToken} from "../utils/jwt.js";
import {hashPassword , verifyPassword} from "../utils/password.js";
import userRepo from "../repositories/user.repo.js";

const register = async (userData) => {
    const { email, pass } = userData;
    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
        const error = new Error("User already exists");
        error.status = 409;
        throw error;
    }
    const hashedPass =  await hashPassword(pass);
    const newUser = await userRepo.createUser({ email, pass: hashedPass });
    return { id: newUser.id, email: newUser.email };
}

const login = async (userData) => {
    const { email } = userData;
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
    }

    const verifyPass = await verifyPassword(userData.password, user.password);
    if (!verifyPass) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
    }
    const token = generateToken({ userId: user.id, email: user.email });
    return { token };
}

export default { register, login };


