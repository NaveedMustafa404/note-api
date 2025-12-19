import { connectDB } from "../config/database.js"; 

const getModels = () => {
  const sequelize = connectDB();
  return sequelize.models;
};


const findShare = async ({ noteId, sharedWithUserId }) => {
  const { NoteShare } = getModels();
  return NoteShare.findOne({ where: { noteId, sharedWithUserId } });
};

const upsertShare = async ({ noteId, sharedWithUserId, permission }) => {
  const { NoteShare } = getModels();

  const existing = await NoteShare.findOne({
    where: { noteId, sharedWithUserId },
  });

  if (existing) {
    existing.permission = permission;
    await existing.save();
    return existing;
  }

  return NoteShare.create({ noteId, sharedWithUserId, permission });
};

const deleteShare = async ({ noteId, sharedWithUserId }) => {
  const { NoteShare } = getModels();
  return NoteShare.destroy({ where: { noteId, sharedWithUserId } });
};

const listSharedWithUser = async ({ sharedWithUserId }) => {
  const { NoteShare } = getModels();
  return NoteShare.findAll({
    where: { sharedWithUserId },
    order: [["createdAt", "DESC"]],
  });
};

export default {
  findShare,
  upsertShare,
  deleteShare,
  listSharedWithUser,
};
