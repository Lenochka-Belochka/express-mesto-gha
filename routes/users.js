const usersRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.post('/users', createUser);
usersRouter.get('/users/:id', getUserId);
usersRouter.patch('/users/me/avatar', updateUserAvatar);
usersRouter.patch('/users/me', updateUserInfo);

module.exports = usersRouter;
