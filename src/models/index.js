import Sequelize from "sequelize";
import userModel from "./user.model.js";
import noteModel from "./note.model.js";
import noteHistoryModel from "./notehistory.model.js";
import createNoteShare from "./noteShare.model.js";
import NoteAttachmentModel from "./noteAttachment.model.js";
import refreshTokenModel from "./refreshToken.model.js";


export const initModels = (sequelize) => {
    const User = userModel(sequelize, Sequelize.DataTypes);
    const Note = noteModel(sequelize, Sequelize.DataTypes);
    const NoteHistory = noteHistoryModel(sequelize, Sequelize.DataTypes);
    const NoteShare = createNoteShare(sequelize, Sequelize.DataTypes);
    const NoteAttachment = NoteAttachmentModel(sequelize, Sequelize.DataTypes);
    const RefreshToken = refreshTokenModel(sequelize, Sequelize.DataTypes);


    User.hasMany(Note, { foreignKey: "userId" });
    Note.belongsTo(User, { foreignKey: "userId" });

    User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
    RefreshToken.belongsTo(User, { foreignKey: "userId" });


    Note.hasMany(NoteHistory, { foreignKey: "noteId", as: "history" });
    NoteHistory.belongsTo(Note, { foreignKey: "noteId" });

    Note.hasMany(NoteShare, { foreignKey: "noteId", as: "shares" });

    Note.hasMany(NoteAttachment, { foreignKey: "noteId", as: "attachments", });
    NoteAttachment.belongsTo(Note, { foreignKey: "noteId", });

    return { User, Note, NoteHistory, NoteShare, NoteAttachment, RefreshToken };
};