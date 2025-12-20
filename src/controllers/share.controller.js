import shareService from "../services/share.service.js";
import { validateShare } from "../validators/share.validators.js";

export const shareNote = async (req, res, next) => {
    try {
        const errMsg = validateShare(req.body);
        if (errMsg) return res.status(400).json({ success: false, message: errMsg });

        const data = await shareService.shareNote({
            ownerId: req.user.id,
            noteId: req.params.id,
            email: req.body.email,
            permission: req.body.permission,
        });

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const unshareNote = async (req, res, next) => {
    try {
        const data = await shareService.unshareNote({
            ownerId: req.user.id,
            noteId: req.params.id,
            email: req.query.email,
        });

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const getSharedWithMe = async (req, res, next) => {
    try {
        const data = await shareService.getSharedWithMe({ userId: req.user.id });
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
