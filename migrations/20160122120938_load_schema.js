
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('questions', function(table) {
      table.increments('id');
      table.string('question');
    }),
    knex.schema.createTable('people', function(table) {
      table.increments('id');
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('phone_number');
    })
  ]).then(function() {
    return Promise.all([
      knex.schema.createTable('contractors', function(table) {
        table.increments('id');
        table.integer('person_id').references('id').inTable('people').onDelete('CASCADE');
      }),
      knex.schema.createTable('customers', function(table) {
        table.increments('id');
        table.string('business_name');
        table.integer('person_id').references('id').inTable('people').onDelete('CASCADE');
      })
    ]);
  }).then(function() {
    return knex.schema.createTable('events', function(table) {
      table.increments('id');
      table.date('date');
      table.string('event_name');
      table.integer('contractor_id').references('id').inTable('contractors').onDelete('CASCADE');
      table.integer('customer_id').references('id').inTable('customers').onDelete('CASCADE');
    });
  }).then(function() {
    return knex.schema.createTable('surveys', function(table) {
      table.increments('id');
      table.integer('event_id').references('id').inTable('events').onDelete('CASCADE');
    });
  }).then(function() {
    return knex.schema.createTable('responses', function(table) {
      table.integer('survey_id').references('id').inTable('surveys').onDelete('CASCADE');
      table.integer('question_id').references('id').inTable('questions').onDelete('CASCADE');
      table.primary(['survey_id', 'question_id']);
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('responses').then(function() {
    return knex.schema.dropTableIfExists('surveys');
  }).then(function() {
    return knex.schema.dropTableIfExists('events');
  }).then(function() {
    return Promise.all([
      knex.schema.dropTableIfExists('customers'),
      knex.schema.dropTableIfExists('contractors')
    ]);
  }).then(function() {
    return Promise.all([
      knex.schema.dropTableIfExists('people'),
      knex.schema.dropTableIfExists('questions')
    ])
  })
};
