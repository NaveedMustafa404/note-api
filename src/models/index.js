import Sequelize from "sequelize";
import userModel from "./user.model.js";
import noteModel from "./note.model.js";
import noteHistoryModel from "./notehistory.model.js";

export const initModels = (sequelize) => {
  const User = userModel(sequelize, Sequelize.DataTypes);
  const Note = noteModel(sequelize, Sequelize.DataTypes);
  const NoteHistory = noteHistoryModel(sequelize, Sequelize.DataTypes);

  User.hasMany(Note, { foreignKey: "userId" });
  Note.belongsTo(User, { foreignKey: "userId" });

  Note.hasMany(NoteHistory, { foreignKey: "noteId", as: "history" });
  NoteHistory.belongsTo(Note, { foreignKey: "noteId" });

  return { User, Note, NoteHistory };
};