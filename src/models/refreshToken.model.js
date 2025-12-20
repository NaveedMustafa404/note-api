export default (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define(
        "RefreshToken",
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },

            userId: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },

            tokenHash: {
                type: DataTypes.STRING(64), // sha256 hex length = 64
                allowNull: false,
                unique: true,
            },

            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },

            revokedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: "refresh_tokens",
            timestamps: true,
            indexes: [
                { fields: ["userId"] },
                { unique: true, fields: ["tokenHash"] },
                { fields: ["expiresAt"] },
            ],
        }
    );

    return RefreshToken;
};
