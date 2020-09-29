require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV } = require('../../src/config/envConfig');

const errors = require('../../src/middlewares/errors');
const noteRouter = require('../routes/noteRouter');
const folderRouter = require('../routes/folderRouter');

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev';

const app = express();
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express boilerplate initialized!');
});

/*
| ROUTES HERE -------------------------
*/

app.use('/notes', noteRouter)
app.use('/folders', folderRouter)

/*
|--------------------------------------
*/

app.use(errors.notFound);
app.use(errors.errorHandler);

module.exports = app;
