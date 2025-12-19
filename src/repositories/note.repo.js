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

const updateNoteVersion = async ({ noteId, userId, newVersion }) => {
  const { Note } = getModels();

  const [updatedRows] = await Note.update(
    { currentVersion: newVersion },
    {
      where: {
        id: noteId,
        userId,
        currentVersion: newVersion - 1,
      },
    }
  );

  return updatedRows; 
};

export default {
  createNote,
  findAllByUser,
  findByIdAndUser,
  updateNoteVersion
};