const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tour.routes');

//midddleware
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use('/api/v1/tours', tourRouter);

module.exports = app;