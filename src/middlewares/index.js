// src/middlewares/index.js

const errorHandler = require('./errorHandler.js');
const notFoundHandler = require('./notFoundHandler.js');

module.exports = {
  errorHandler,
  notFoundHandler,
};