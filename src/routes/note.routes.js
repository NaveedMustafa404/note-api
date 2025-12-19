import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {createNote, getAllNotes,getNoteById, updateNote} from "../controllers/note.controller.js";

const router = Router();

router.use(isAuthenticated);

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);

export default router;