import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {createNote, getAllNotes,getNoteById, updateNote, revertNote} from "../controllers/note.controller.js";

const router = Router();

router.use(isAuthenticated);

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.post("/:id/revert", revertNote);

export default router;