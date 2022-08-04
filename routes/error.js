const errorRouter = require("express").Router();

errorRouter.all("*", (req, res) => {
  res.status(404).send({ message: "Ресурс не найден" });
});

module.exports = errorRouter;
