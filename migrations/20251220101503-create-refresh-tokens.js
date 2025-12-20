export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("refresh_tokens", {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    userId: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    tokenHash: {
      type: Sequelize.STRING(64),
      allowNull: false,
      unique: true,
    },

    expiresAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    revokedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  await queryInterface.addIndex("refresh_tokens", ["userId"]);
  await queryInterface.addIndex("refresh_tokens", ["expiresAt"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("refresh_tokens");
}
