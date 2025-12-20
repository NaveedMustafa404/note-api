export default (sequelize, DataTypes) => {
  const NoteAttachment = sequelize.define(
    "NoteAttachment",
    {
      noteId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "note_id",
      },

      uploadedByUserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "uploaded_by_user_id",
      },

      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "original_name",
      },

      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "mime_type",
      },

      sizeBytes: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "size_bytes",
      },

      storagePath: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "storage_path",
      },
    },
    {
      tableName: "note_attachments",
      underscored: true,
      timestamps: false, 
    }
  );

  return NoteAttachment;
};
