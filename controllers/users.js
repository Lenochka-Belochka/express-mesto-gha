const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const DuplicateDataError = require('../errors/DuplicateDataError');

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, name, about, avatar } = req.body;
  
    bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((data) => {
      res.status(200).send({
        name: data.name,
        about: data.about,
        avatar: data.avatar,
        _id: data._id,
        email: data.email,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequest('Проблема с валидацией на сервере');
      } else if (error.code === 11000) {
        throw new DuplicateDataError('Указанный email уже существует');
      }
      next(error);
    })
    .catch(next);
};

const getUserId = (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      }
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequest('Ошибочный id');
      }
      next(error);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
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

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate(
    { id: userId },
    { name, about },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (!data) {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        res.status(200).send(data);
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequest('Проблема с валидацией на сервере');
      }
      next(error);
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate(
    { id: userId },
    { avatar },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (!data) {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        res.status(200).send(data);
      }
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
  login,
  getCurrentUser,
};
