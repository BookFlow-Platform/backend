const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const { ConflictError } = require("../errors/ConflictError");

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name, dateOfBirth, gender, lastName, patronymic } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name, dateOfBirth, gender, lastName, patronymic },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(
          new NotFoundError(
            `Пользователь с указанным _id: ${req.user._id} не найден.`
          )
        );
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Пользователь с таким email существует."));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректные данные."));
        return;
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(
          new NotFoundError(
            `Пользователь с указанным _id: ${req.user._id} не найден.`
          )
        );
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректные данные."));
        return;
      }
      next(err);
    });
};