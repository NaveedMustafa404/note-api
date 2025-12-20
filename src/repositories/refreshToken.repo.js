import { connectDB } from "../config/database.js";
import { Op } from "sequelize";

const getModels = () => {
    const sequelize = connectDB();
    return sequelize.models;
};

export const create = async ({ userId, tokenHash, expiresAt }) => {
    const { RefreshToken } = getModels();
    return RefreshToken.create({ userId, tokenHash, expiresAt });
};

export const findValid = async (tokenHash) => {
    const { RefreshToken } = getModels();
    return RefreshToken.findOne({
        where: {
            tokenHash,
            revokedAt: null,
            expiresAt: { [Op.gt]: new Date() },
        },
    });
};

export const revoke = async (id) => {
    const { RefreshToken } = getModels();
    return RefreshToken.update(
        { revokedAt: new Date() },
        { where: { id } }
    );
};

export const revokeByHash = async (tokenHash) => {
    const { RefreshToken } = getModels();
    return RefreshToken.update(
        { revokedAt: new Date() },
        { where: { tokenHash, revokedAt: null } }
    );
};

export const revokeAllForUser = async (userId) => {
    const { RefreshToken } = getModels();
    return RefreshToken.update(
        { revokedAt: new Date() },
        { where: { userId, revokedAt: null } }
    );
};

export default { create, findValid, revoke, revokeByHash, revokeAllForUser };
