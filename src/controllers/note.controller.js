import noteService from "../services/note.service.js";
import { validateNoteCreation, validateNoteUpdate, } from "../validators/note.validators.js";

export const createNote = async (req, res, next) => {
    try {
        const errMsg = validateNoteCreation(req.body);
        if (errMsg.length > 0) {
            return res.status(400).json({
                success: false,
                message: errMsg.join(", "),
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

export const updateNote = async (req, res, next) => {
    try {
        const errMsg = validateNoteUpdate(req.body);
        if (errMsg)
            return res.status(400).json({ success: false, message: errMsg });

        const data = await noteService.updateNote({
            noteId: req.params.id,
            userId: req.user.id,
            ...req.body,
        });

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const revertNote = async (req, res, next) => {
    try {
        const data = await noteService.revertNote({
            noteId: req.params.id,
            userId: req.user.id,
            targetVersion: Number(req.body.version),
        });

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const searchNotes = async (req, res, next) => {
    try {
        const data = await noteService.searchNotes({
            userId: req.user.id,
            keyword: req.query.q,
        });

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const deleteNote = async (req, res, next) => {
    try {
        const data = await noteService.deleteNote({
            noteId: req.params.id,
            userId: req.user.id,
        });

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};


