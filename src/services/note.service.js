import noteRepo from "../repositories/note.repo.js";
import noteHistoryRepo from "../repositories/noteHistories.repo.js";
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

export default {
  createNote,
  getAllNotes,
  getNoteById,
};