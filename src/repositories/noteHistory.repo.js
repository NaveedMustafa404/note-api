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

const searchLatestNotes = async ({ userId, keyword }) => {
    const sequelize = connectDB();

    const [results] = await sequelize.query(
        `
    SELECT 
      n.id AS noteId,
      h.version_number,
      h.title,
      h.content
    FROM notes n
    JOIN note_histories h
      ON h.note_id = n.id
     AND h.version_number = n.current_version
    WHERE 
      n.user_id = :userId
      AND n.deleted_at IS NULL
      AND MATCH(h.title, h.content)
          AGAINST (:keyword IN NATURAL LANGUAGE MODE)
    ORDER BY h.created_at DESC
    `,
        {
            replacements: { userId, keyword },
        }
    );

    return results;
};

export default {
    createHistory,
    findLatestVersionByNote,
    searchLatestNotes
};
