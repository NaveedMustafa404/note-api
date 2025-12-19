import {connectDB} from "../config/database.js";

const getModels = () => {
    const sequelize = connectDB();
    return sequelize.models;
}
export const findUserByEmail = async (email) => {
    const { User } = await getModels();
    return User.findOne({ where: { email } });
}

export const createUser = async ({email, pass}) => {
    const { User } = await getModels();
    return User.create({ email, pass });
}
export default { findUserByEmail, createUser };