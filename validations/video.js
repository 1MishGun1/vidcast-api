const { body } = require("express-validator");

const videoValidation = [
  body("title", "Обязательное поле 'Название видео'")
    .isLength({ min: 1 })
    .isString(),
  body("description", "Обязательное поле 'Описание'")
    .isLength({ min: 10 })
    .isString(),
  body("tags", "Неккоректные тэги").optional().isString(),
  body("cover", "Некоректный файл обложки").optional().isString(),
  body("videoUrl", "Некоректный файл видео").optional().isString(),
];

module.exports = videoValidation;
