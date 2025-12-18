
export default (sequelize, DataTypes) => {
  const Note = sequelize.define("Note", {
    id: { type: DataTypes.BIGINT.UNSIGNED,autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.BIGINT.UNSIGNED,allowNull: false },
    currentVersion: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },

  },

  {
    tableName: "notes",
    underscored: true,
    timestamps: true,
    paranoid: true, 
  });

  return Note;
};