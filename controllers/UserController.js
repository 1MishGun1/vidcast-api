const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserModel = require("../models/User");

//! Register a new user
const register = async (req, res) => {
  console.log(req.body);

  try {
    const password = req.body.password;
    const saltPassword = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, saltPassword);

    const doc = new UserModel({
      name: req.body.name,
      surname: req.body.surname,
      login: req.body.login,
      email: req.body.email,
      passwordHash: hash,
      avatar: req.body.avatar,
      coverProfile: req.body.coverProfile,
    });

    const user = await doc.save();

    const tokenUser = jwt.sign(
      {
        _id: user._id,
        passwordHash: user.passwordHash,
      },
      "secret-key-password-123-dasd",
      {
        expiresIn: "10d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, tokenUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ошибка регистрации. Попробуйте еще раз",
    });
  }
};

//! Authorization user
const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ login: req.body.login });

    if (!user) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const tokenUser = jwt.sign(
      {
        _id: user._id,
        passwordHash: user.passwordHash,
      },
      "secret-key-password-123-dasd",
      {
        expiresIn: "10d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, tokenUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ошибка авторизации. Попробуйте еще раз",
    });
  }
};

module.exports = { register, login };
