"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("note_shares", {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    note_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    shared_with_user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    permission: {
      type: Sequelize.ENUM("read", "edit"),
      allowNull: false,
      defaultValue: "read",
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("note_shares");
}
