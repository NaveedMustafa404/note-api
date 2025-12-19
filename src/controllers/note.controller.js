import noteService from "../services/note.service.js";
import { validateNoteCreation } from "../validators/note.validators.js";

export const createNote = async (req, res, next) => {
  try {
    const errMsg = validateNoteCreation(req.body);
    if (errMsg.length > 0) { 
      return res.status(400).json({ 
        success: false, 
        message: errMsg.join(", ")
      });
    }

    const data = await noteService.createNote({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getAllNotes = async (req, res, next) => {
  try {
    const data = await noteService.getAllNotes(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const data = await noteService.getNoteById({
      noteId: req.params.id,
      userId: req.user.id,
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};