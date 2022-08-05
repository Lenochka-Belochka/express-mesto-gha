const errorRouter = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

errorRouter.all('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

module.exports = errorRouter;
