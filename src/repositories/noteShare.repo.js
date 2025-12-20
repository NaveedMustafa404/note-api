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

const listSharedWithMe = async ({ userId }) => {
    const sequelize = connectDB();

    const [rows] = await sequelize.query(
        `
    SELECT
      n.id AS noteId,
      n.user_id AS ownerId,
      ns.permission,
      h.version_number,
      h.title,
      h.content,
      h.created_at
    FROM note_shares ns
    JOIN notes n ON n.id = ns.note_id
    JOIN note_histories h
      ON h.note_id = n.id
     AND h.version_number = n.current_version
    WHERE
      ns.shared_with_user_id = :userId
      AND n.deleted_at IS NULL
    ORDER BY ns.created_at DESC
    `,
        { replacements: { userId } }
    );

    return rows;
};

export default {
    findShare,
    upsertShare,
    deleteShare,
    listSharedWithUser,
    listSharedWithMe
};
