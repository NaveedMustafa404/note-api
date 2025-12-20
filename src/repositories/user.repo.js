import { connectDB } from "../config/database.js";

const getModels = () => {
    const sequelize = connectDB();
    return sequelize.models;
};

export const findUserByEmail = async (email) => {
    const { User } = getModels();
    console.log("Looking for user with email:", email);
    return User.findOne({ where: { email } });
}

export const createUser = async ({ email, password }) => {
    const { User } = getModels();
    return User.create({ email, password });
}
export default { findUserByEmail, createUser };

