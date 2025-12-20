import searchService from "../services/search.service.js";

export const searchNotes = async (req, res, next) => {
  try {
    const data = await searchService.searchNotes({
      userId: req.user.id,
      keyword: req.query.q,
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
