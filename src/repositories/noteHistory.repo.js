import { connectDB } from "../config/database.js";

const getModels = () => {
  const sequelize = connectDB();
  return sequelize.models;
};

const createHistory = async ({ noteId, versionNumber, title, content }) => {
  const { NoteHistory } = getModels();
  
  return NoteHistory.create({ noteId, versionNumber, title, content });
};

const findLatestVersionByNote = async (noteId, versionNumber) => {
  const { NoteHistory } = getModels();

  return NoteHistory.findOne({
    where: { noteId, versionNumber },
  });
};

export default {
  createHistory,
  findLatestVersionByNote,
};
