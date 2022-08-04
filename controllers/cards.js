const Card = require('../models/card');

const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Проблема с валидацией на сервере отправка карточки' });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};
const removeCard = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Карточка с данным id:${cardId} не найдена` });
        return;
      }
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: `Карточка с id:${cardId} не найдена` });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

const findCard = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Карточки отсутствуют' });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

const addLike = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Карточка с указанным id:${cardId} не найдена в базе` });
        return;
      }
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Карточка отсутствует' });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

const removeLike = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Карточки с таким id:${cardId} нет` });
        return;
      }
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports = {
  postCard, findCard, removeCard, addLike, removeLike,
};