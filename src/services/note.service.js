import noteRepo from "../repositories/note.repo.js";
import noteHistoryRepo from "../repositories/noteHistory.repo.js";
import cacheService from "./cache.service.js";
import permissionService from "./permission.service.js";

const createNote = async ({ userId, title, content }) => {
    const note = await noteRepo.createNote(userId);

    await noteHistoryRepo.createHistory({
        noteId: note.id,
        versionNumber: 1,
        title,
        content,
    });

    await cacheService.del(`notes:user:${userId}`);

    return { id: note.id, version: 1 };
};

const getAllNotes = async (userId) => {
    const cacheKey = `notes:user:${userId}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const notes = await noteRepo.findAllByUser(userId);

    const result = notes.map((n) => ({
        id: n.id,
        currentVersion: n.currentVersion,
        updatedAt: n.updatedAt,
    }));

    await cacheService.set(cacheKey, result, 300);
    return result;
};

const getNoteById = async ({ noteId, userId }) => {
    const cacheKey = `note:${noteId}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    // We are using permission service to check access rights

    // previous implementation: Owner specific
    //   const note = await noteRepo.findByIdAndUser(noteId, userId);
    //   if (!note) {
    //     const err = new Error("Note not found");
    //     err.statusCode = 404;
    //     throw err;
    //   }

    const { note } = await permissionService.canReadNote({ noteId, userId });

    const version = await noteHistoryRepo.findLatestVersionByNote(
        note.id,
        note.currentVersion
    );

    const result = {
        id: note.id,
        version: note.currentVersion,
        title: version.title,
        content: version.content,
    };

    await cacheService.set(cacheKey, result, 300);
    return result;
};

const updateNote = async ({ noteId, userId, title, content, versionNumber }) => {

    // We are using permission service to check access rights
    //   const note = await noteRepo.findByIdAndUser(noteId, userId);
    //   if (!note) {
    //     const err = new Error("Note not found");
    //     err.statusCode = 404;
    //     throw err;
    //   }

    const note = await permissionService.canEditNote({ noteId, userId });

    if (note.currentVersion !== versionNumber) {
        const err = new Error("Version conflict. Please refresh.");
        err.statusCode = 409;
        throw err;
    }

    const newVersion = versionNumber + 1;

    await noteHistoryRepo.createHistory({
        noteId,
        versionNumber: newVersion,
        title,
        content,
    });

    const updated = await noteRepo.updateNoteVersion({
        noteId,
        userId: note.userId,
        newVersion,
    });

    if (!updated) {
        const err = new Error("Concurrent update detected");
        err.statusCode = 409;
        throw err;
    }

    await cacheService.del(`notes:user:${userId}`);
    await cacheService.del(`note:${noteId}`);

    return { id: noteId, version: newVersion };
};

const revertNote = async ({ noteId, userId, targetVersion }) => {

    // We are using permission service to check access rights
    //   const note = await noteRepo.findByIdAndUser(noteId, userId);
    //   if (!note) {
    //     const err = new Error("Note not found");
    //     err.statusCode = 404;
    //     throw err;
    //   }
    const note = await permissionService.canEditNote({ noteId, userId });

    const revertVersion = await noteHistoryRepo.findLatestVersionByNote(
        noteId,
        targetVersion
    );

    if (!revertVersion) {
        const err = new Error("Target version not found");
        err.statusCode = 404;
        throw err;
    }

    const newVersion = note.currentVersion + 1;

    await noteHistoryRepo.createHistory({
        noteId,
        versionNumber: newVersion,
        title: revertVersion.title,
        content: revertVersion.content,
    });

    await noteRepo.updateNoteVersion({
        noteId,
        userId: note.userId,
        newVersion,
    });

    await cacheService.del(`notes:user:${userId}`);
    await cacheService.del(`note:${noteId}`);

    return { id: noteId, version: newVersion };
};

const searchNotes = async ({ userId, keyword }) => {
    if (!keyword || keyword.trim() === "") {
        const err = new Error("Keyword cannot be empty");
        err.statusCode = 400;
        throw err;
    }
    return noteHistoryRepo.searchLatestNotes({ userId, keyword });
};

const deleteNote = async ({ noteId, userId }) => {
    const deleted = await noteRepo.softDeleteNote({ noteId, userId });

    if (!deleted) {
        const err = new Error("Note not found");
        err.statusCode = 404;
        throw err;
    }

    await cacheService.del(`notes:user:${userId}`);
    await cacheService.del(`note:${noteId}`);

    return { id: noteId, deleted: true };
};

export default {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    revertNote,
    searchNotes,
    deleteNote,
};
