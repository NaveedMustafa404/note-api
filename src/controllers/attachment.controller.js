import attachmentService from "../services/attachment.service.js";

export const uploadAttachment = async (req, res, next) => {
  try {
    const data = await attachmentService.upload({
      noteId: req.params.id,
      userId: req.user.id,
      file: req.file,
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const listAttachments = async (req, res, next) => {
    try {
        const data = await attachmentService.list({
            noteId: req.params.id,
            userId: req.user.id,
        });

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};