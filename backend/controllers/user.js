const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {BlackListModel } = require("../models/blacklist.model");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isUserPresent = await UserModel.findOne({ email });

    if (isUserPresent) {
      return res
        .status(401)
        .send({ msg: "user already register ! Login Please" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = new UserModel({
      name,
      email,
      password: hashPassword,
    });
    await createUser.save();
    res.status(200).send({ msg: "user created", createUser });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUserPresent = await UserModel.findOne({ email });
    if (!isUserPresent) {
      return res.status(401).send({ msg: "User not found" });
    }
    const IsPass = await bcrypt.compare(password, isUserPresent.password);

    if (!IsPass) {
      return res.status(401).send({ msg: "invalid credentials" });
    }

    const token = jwt.sign(
      { userId: isUserPresent.id },
      process.env.AccessToken,
      { expiresIn: "1hr" }
    );

    res.status(200).send({ msg: "login success", token });
  } catch (error) {
    res.status(400).send(error.message)
  }
};


const logout = async(req,res) => {
    try {
        const token = req.headers?.authorization;
        if(!token){
            return res.status(401).send({msg:"Token not provided"})
        }
     
        const blacklistToken= new BlackListModel({token:token})
        await blacklistToken.save();
        res.status(200).send({msg:"logout success"})
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
  register,
  login,
  logout
};
