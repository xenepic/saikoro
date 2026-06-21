/**
 * クイズの連続正解数ランキングを、これまでのCCAs.jsonファイルベースの永続化から
 * DBテーブルへ移行するためのマイグレーション。
 */
exports.up = function up(knex) {
  return knex.schema.createTable('quiz_score', (table) => {
    table.string('name', 255).primary();
    table.integer('max_num_of_cca').notNullable().defaultTo(0);
    table.integer('num_of_cca').notNullable().defaultTo(0);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('quiz_score');
};
