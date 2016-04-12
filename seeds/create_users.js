
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({id: 1, username: 'first_user', password: 'testing'}),
    knex('users').insert({id: 2, username: 'second_user', password: 'testing'}),
    knex('users').insert({id: 3, username: 'third_user', password: 'testing'})
  );
};
