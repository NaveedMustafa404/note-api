'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("note_histories", {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT("long"),
      allowNull: false,
    },
    version_number: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    note_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
  
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  });

  await queryInterface.addIndex(
    "note_histories", ["note_id", "version_number"],
    { unique: true }
  );
}

export async function down(queryInterface) {
  await queryInterface.dropTable("note_histories");
}
