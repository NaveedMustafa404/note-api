'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.query(`
    ALTER TABLE note_histories
    ADD FULLTEXT INDEX idx_fulltext_title_content (title, content);
  `);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.query(`
    ALTER TABLE note_histories
    DROP INDEX idx_fulltext_title_content;
  `);
}