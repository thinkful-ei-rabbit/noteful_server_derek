const knex = require('knex')
const app = require('./app');
const logger = require('../../src/libs/logger');
const { PORT, DATABASE_URL } = require('../../src/config/envConfig');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL
});
app.set('db', db)

app.listen(PORT, () => {
  logger.http(`Server listening at http://localhost:${PORT}`);
});
