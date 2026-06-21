/**
 * 既存運用中の `gacha` テーブルのスキーマを再現するマイグレーション。
 * gacha.js / quiz.js から読み書きされる、ユーザーごとのさいころポイント(sp)とガチャ結果カウンタを保持する。
 */
exports.up = function up(knex) {
  return knex.schema.createTable('gacha', (table) => {
    table.string('name', 255).primary();
    table.integer('sp').notNullable().defaultTo(100);
    table.integer('star').notNullable().defaultTo(0);
    table.integer('face').notNullable().defaultTo(0);
    table.integer('fire').notNullable().defaultTo(0);
    table.integer('dango').notNullable().defaultTo(0);
    table.integer('crab').notNullable().defaultTo(0);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('gacha');
};
