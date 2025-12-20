import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  revertNote,
  searchNotes,
  deleteNote,
} from "../controllers/note.controller.js";
import { shareNote, getSharedWithMe, unshareNote } from "../controllers/share.controller.js";

const router = Router();

router.use(isAuthenticated);

router.post("/create", createNote);
router.get("/all-list", getAllNotes);
router.get("/by/:id", getNoteById);
router.put("/update/:id", updateNote);
router.post("/revert/:id", revertNote);
router.get("/search", searchNotes);
router.delete("/delete/:id", deleteNote);

// Note share
router.post("/share/:id", shareNote);
router.get("/shared-with-me", getSharedWithMe);
router.delete("/unshare/:id", unshareNote);

export default router;
