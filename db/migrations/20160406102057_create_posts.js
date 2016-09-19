exports.up = function(knex, Promise) {
  return knex.schema.createTable('likes', (t) =>{
    t.increments();
    t.bigInteger('liker').unsigned().index().references('id').inTable('users').onDelete('cascade')
    t.bigInteger('likee').unsigned().index().references('id').inTable('users').onDelete('cascade')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('likes');
};
