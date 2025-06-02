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

//! Get user info
const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Нет прав доступа",
    });
  }
};

//! Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().populate("login").exec();
    res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Не удалось отобразить всех пользователей",
    });
  }
};

//! Get one user
const getOneUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select("-passwordHash -tokenUser")
      .exec();

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не удалось получить пользователя",
    });
  }
};

//! Toggle subscription
const toggleSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    const channelId = req.params.id;

    const user = await UserModel.findById(userId);
    const channel = await UserModel.findById(channelId);

    if (!user || !channel) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const isSubscribed = user.subscriptions.includes(channelId);

    if (isSubscribed) {
      // Отписываемся
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { subscriptions: channelId },
      });
      await UserModel.findByIdAndUpdate(channelId, {
        $pull: { subscribers: userId },
      });
    } else {
      // Подписываемся
      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { subscriptions: channelId },
      });
      await UserModel.findByIdAndUpdate(channelId, {
        $addToSet: { subscribers: userId },
      });
    }

    res.json({ isSubscribed: !isSubscribed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка подписки" });
  }
};

//! Check subscription
const checkSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    const channelId = req.params.id;

    const user = await UserModel.findById(userId);
    const channel = await UserModel.findById(channelId);

    if (!user || !channel) {
      return res
        .status(404)
        .json({ message: "Пользователь или канал не найден" });
    }

    const isSubscribed = user.subscriptions.includes(channelId);
    const subscribersCount = channel.subscribers.length;

    res.json({ isSubscribed, subscribersCount, channelId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка проверки подписки" });
  }
};

//! Get count sub by all users
const getSubscribersCount = async (req, res) => {
  try {
    const channelId = req.params.id;
    const channel = await UserModel.findById(channelId);

    if (!channel) {
      return res.status(404).json({ message: "Канал не найден" });
    }

    res.json({ subscribersCount: channel.subscribers.length });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ошибка получения количества подписчиков" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  getOneUser,
  toggleSubscription,
  checkSubscription,
  getSubscribersCount,
};
