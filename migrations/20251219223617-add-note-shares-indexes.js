"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addIndex("note_shares", ["note_id", "shared_with_user_id"], {
    unique: true,
    name: "uq_note_share",
  });


  await queryInterface.addIndex("note_shares", ["shared_with_user_id"], {
    name: "idx_note_shares_shared_user",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex("note_shares", "uq_note_share");
  await queryInterface.removeIndex("note_shares", "idx_note_shares_shared_user");
}