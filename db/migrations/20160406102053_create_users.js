exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (t) =>{
    t.increments()
    t.text('username').unique().notNullable();
    t.text('password').notNullable();
    t.integer('age').notNullable();
    t.integer('miles_from_demo_user');
    t.text('gender');
    t.text('gender_preference');
    t.text('religion');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
