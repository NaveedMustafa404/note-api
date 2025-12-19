import {connectDB} from "../config/database.js";

const getModels = () => {
    const sequelize = connectDB();
    return sequelize.models;
}

const createNote = async (userId) => {
  const { Note } = getModels();
  return Note.create({ userId });
};

const findAllByUser = async (userId) => {
  const { Note } = getModels();
  return Note.findAll({
    where: { userId },
    order: [["updatedAt", "DESC"]],
  });
};

const findByIdAndUser = async (id, userId) => {
  const { Note } = getModels();
  return Note.findOne({ where: { id, userId } });
};

export default {
  createNote,
  findAllByUser,
  findByIdAndUser,
};