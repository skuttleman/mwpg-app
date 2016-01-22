
exports.up = function(knex, Promise) {
  return knex.schema.createTable('templates', function(table) {
    table.increments('id');
    table.string('name');
  }).then(function() {
    return Promise.all([
      knex.schema.createTable('template_questions', function(table) {
        table.integer('template_id').references('id').inTable('templates').onDelete('CASCADE');
        table.integer('question_id').references('id').inTable('questions').onDelete('CASCADE');
        table.primary(['template_id', 'question_id']);
      }),
      knex.schema.table('surveys', function(table) {
        table.integer('template_id').references('id').inTable('templates').onDelete('CASCADE');
      })
    ]);
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('surveys', function(table) {
      table.dropColumn('template_id');
    }),
    knex.schema.dropTableIfExists('template_questsions')
  ]).then(function() {
    return knex.schema.dropTableIfExists('templates');
  });
};
