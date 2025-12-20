import { connectDB } from "../config/database.js";

const getModels = () => {
    const sequelize = connectDB();
    return sequelize.models;
}

const create = async ({
    noteId,
    uploadedByUserId,
    originalName,
    mimeType,
    sizeBytes,
    storagePath,
}) => {
    const { NoteAttachment } = getModels();

    return NoteAttachment.create({
        noteId,
        uploadedByUserId,
        originalName,
        mimeType,
        sizeBytes,
        storagePath,
    });
};

const findByNote = async (noteId) => {
    const { NoteAttachment } = getModels();

    return NoteAttachment.findAll({
        where: { noteId }
        // order: [["createdAt", "DESC"]],
    });
};

const findById = async (id) => {
    const { NoteAttachment } = getModels();

    return NoteAttachment.findOne({
        where: { id },
    });
};

const deleteById = async (id) => {
    const { NoteAttachment } = getModels();

    return NoteAttachment.destroy({
        where: { id },
    });
};

export default {
    create,
    findByNote,
    findById,
    deleteById,
};
