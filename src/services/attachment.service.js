import { canEditNote, canReadNote } from "./permission.service.js";
import attachmentRepo from "../repositories/attachment.repo.js";

const upload = async ({ noteId, userId, file }) => {
    if (!file) {
        const err = new Error("File required");
        err.statusCode = 400;
        throw err;
    }

    await canEditNote({ noteId, userId });


    return attachmentRepo.create({
        noteId,
        uploadedByUserId: userId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storagePath: file.path,
    });
};

const list = async ({ noteId, userId }) => {
    await canReadNote({ noteId, userId });
    return attachmentRepo.findByNote(noteId);
};

export default { upload, list };