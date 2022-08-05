const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequest('Проблема с валидацией на сервере');
      }
      next(error);
    })
    .catch(next);
  };

const getUserId = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь с указанным id:${userId} не найден');
      }
      res.status(200).send(data);
      })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequest('Ошибочный id:${userId}');
      }
      next(error);
    })
    .catch(next);
};

const getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new NotFoundError('Пользователи  не существуют');
      }
      next(error);
    })
    .catch(next);
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate(
    { id: userId },
    { name, about },
    { new: true, runValidators: true },
  )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequest('Проблема с валидацией на сервере');
      }
      next(error);
    })
    .catch(next);
};
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate(
    { id: userId },
    { avatar },
    { new: true, runValidators: true },
  )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequest('Проблема с валидацией на сервере');
      }
      next(error);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUserId,
  getUsers,
  updateUserInfo,
  updateUserAvatar,
};
