
exports.up = async function(knex) {
    await knex.schema.createTable('score', (table) => {
        table.increments('id')
        table.string('name')
        table.integer('tries')
        table.integer('time')
        table.timestamp('creation_date')
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTable('score')
};
