export default (sequelize, DataTypes) => {
  const NoteShare = sequelize.define(
    "NoteShare",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      noteId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
      sharedWithUserId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
      permission: {
        type: DataTypes.ENUM("read", "edit"),
        allowNull: false,
        defaultValue: "read",
      },
    },
    {
      tableName: "note_shares",
      underscored: true,
      timestamps: false,
    }
  );

  return NoteShare;
};
