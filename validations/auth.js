const { body } = require("express-validator");

const registerValidation = [
  body("name").isLength({ min: 2 }),
  body("surname").isLength({ min: 2 }),
  body("login", "Неверный логин").isLength({ min: 3 }),
  body("email", "Неверный формат электронной почты").isEmail(),
  body("password", "Слишком короткий пароль").isLength({ min: 5 }),
  body("avatar", "Неверный формат аватарки").optional().isURL(),
  body("coverProfile", "Неверный формат обложки").optional().isURL(),
];

const loginValidation = [
  body("login", "Неверный логин").isLength({ min: 3 }),
  body("password", "Неверный пароль").isLength({ min: 5 }),
];

module.exports = { registerValidation, loginValidation };
