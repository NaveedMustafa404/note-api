import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {createNote, getAllNotes,getNoteById,} from "../controllers/note.controller.js";

const router = Router();

router.use(isAuthenticated);

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);

export default router;