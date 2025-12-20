
export default (sequelize, DataTypes) => {
    const NoteHistory = sequelize.define("NoteHistory", {
        id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING(255), allowNull: false },
        content: { type: DataTypes.TEXT("long"), allowNull: false },
        versionNumber: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

        noteId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },


    },
        {
            tableName: "note_histories",
            underscored: true,
            timestamps: true,
            updatedAt: false,
        });

    return NoteHistory;
};
