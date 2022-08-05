const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequest('Проблема с валидацией на сервере отправка карточки');
      }
      next(error);
    });
};
const removeCard = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Карточка с данным id не найдена');
      }
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequest('Карточка отсутствует');
      }
      next(error);
    })
    .catch(next);
};

const findCard = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new NotFoundError('Карточки не созданы');
      }
      next(error);
    })
    .catch(next);
};

const addLike = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Карточка с данным id не найдена');
      }
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequest('Карточка отсутствует');
      }
      next(error);
    })
    .catch(next);
};

const removeLike = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        throw new NotFoundError(`Карточка с данным id не найдена`);
      }
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequest('Карточка отсутствует');
      }
      next(error);
    })
    .catch(next);
};

module.exports = {
  postCard,
  findCard,
  removeCard,
  addLike,
  removeLike,
};
