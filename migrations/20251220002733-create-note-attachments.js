'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("note_attachments", {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    note_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: "notes",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    uploaded_by_user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    original_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },

    mime_type: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },

    size_bytes: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },

    storage_path: {
      type: Sequelize.STRING(500),
      allowNull: false,
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  });

  await queryInterface.addIndex("note_attachments", ["note_id"]);
  await queryInterface.addIndex("note_attachments", ["uploaded_by_user_id"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("note_attachments");
}
