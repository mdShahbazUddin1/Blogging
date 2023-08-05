const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const { BlackListModel } = require("../models/blacklist.model");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;

    if (!token) {
      return res.status(401).send({ msg: "token is not provided" });
    }

    const decode = jwt.verify(token, process.env.AccessToken);
    const user = await UserModel.findById({ _id: decode.userId });

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const blacklistToken = await BlackListModel.findOne({ token: token });
    if (blacklistToken) {
      return res.status(401).send({ msg: "login first" });
    }
    req.user = user;
    req.userId = decode.userId;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  auth,
};
