
export default (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
        email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },

    },
        {
            tableName: "users",
            underscored: true,
            timestamps: true
        });

    return User;
};