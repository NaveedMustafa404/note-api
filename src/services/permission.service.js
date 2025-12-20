import noteRepo from "../repositories/note.repo.js";
import noteShareRepo from "../repositories/noteShare.repo.js";

export const canReadNote = async ({ noteId, userId }) => {
    const note = await noteRepo.findById(noteId);
    if (!note || note.deletedAt) {
        const err = new Error("Note not found");
        err.statusCode = 404;
        throw err;
    }

    if (note.userId === userId) {
        return { note, role: "owner", permission: "edit" };
    }

    const share = await noteShareRepo.findShare({
        noteId,
        sharedWithUserId: userId,
    });

    if (!share) {
        const err = new Error("Note not found");
        err.statusCode = 404;
        throw err;
    }

    return { note, role: "shared", permission: share.permission };
};

export const canEditNote = async ({ noteId, userId }) => {
    const { note, permission } = await canReadNote({ noteId, userId });

    if (permission !== "edit") {
        const err = new Error("Forbidden! You do not have edit access to this note.");
        err.statusCode = 403;
        throw err;
    }

    return note;
};
export default { canReadNote, canEditNote };
