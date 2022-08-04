const cardsRouter = require('express').Router();
const {
  postCard,
  findCard,
  removeCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

cardsRouter.post('/cards', postCard);
cardsRouter.get('/cards', findCard);
cardsRouter.delete('/cards/:id', removeCard);
cardsRouter.put('/cards/:id/likes', addLike);
cardsRouter.delete('/cards/:id/likes', removeLike);

module.exports = cardsRouter;
