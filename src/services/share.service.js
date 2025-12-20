import noteRepo from "../repositories/note.repo.js";
import userRepo from "../repositories/user.repo.js";
import noteShareRepo from "../repositories/noteShare.repo.js";

const shareNote = async ({ ownerId, noteId, email, permission }) => {
  const note = await noteRepo.findByIdAndUser(noteId, ownerId);
  if (!note) {
    const err = new Error("Note not found");
    err.statusCode = 404;
    throw err;
  }

  const targetUser = await userRepo.findUserByEmail(email);
  if (!targetUser) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (targetUser.id === ownerId) {
    const err = new Error("Cannot share note with yourself");
    err.statusCode = 400;
    throw err;
  }

  const share = await noteShareRepo.upsertShare({
    noteId: note.id,
    sharedWithUserId: targetUser.id,
    permission,
  });

  return {
    noteId: note.id,
    sharedWith: targetUser.email,
    permission: share.permission,
  };
};

const getSharedWithMe = async ({ userId }) => {
  return noteShareRepo.listSharedWithMe({ userId });
};

export default { shareNote, getSharedWithMe };
