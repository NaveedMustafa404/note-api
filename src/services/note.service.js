import noteRepo from "../repositories/note.repo.js";
import noteHistoryRepo from "../repositories/noteHistory.repo.js";
import cacheService from "./cache.service.js";

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

  const note = await noteRepo.findByIdAndUser(noteId, userId);
  if (!note) {
    const err = new Error("Note not found");
    err.statusCode = 404;
    throw err;
  }

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
  const note = await noteRepo.findByIdAndUser(noteId, userId);
  if (!note) {
    const err = new Error("Note not found");
    err.statusCode = 404;
    throw err;
  }

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
    userId,
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
  const note = await noteRepo.findByIdAndUser(noteId, userId);
  if (!note) {
    const err = new Error("Note not found");
    err.statusCode = 404;
    throw err;
  }

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
    userId,
    newVersion,
  });

  await cacheService.del(`notes:user:${userId}`);
  await cacheService.del(`note:${noteId}`);

  return { id: noteId, version: newVersion };
};


export default {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  revertNote,
};
