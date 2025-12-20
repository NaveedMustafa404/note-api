
import bcrypt from "bcrypt";


export const hashPassword = async (password) => {
    return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword);
};
