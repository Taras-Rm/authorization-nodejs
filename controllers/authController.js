const Role = require("../models/Role.js");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

class AuthController {
  
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Validation error", error: errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with this username already exist" });
      }
      const hashedPassword = await hashPassword(password);
      const userRole = await Role.findOne({ role: "USER" });
      const createdUser = new User({
        username,
        password: hashedPassword,
        roles: [userRole.role],
      });
      await createdUser.save();
      return res.status(200).json({ message: "User was registered" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Validation error", error: errors });
      }
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User with that username not found" });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Uncorrect password" });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Login error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Get users error" });
    }
  }
}

async function hashPassword(password) {
  return await bcrypt.hash(password, 5);
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

function generateAccessToken(id, roles) {
  const payload = {
    id,
    roles,
  };

  const secret = process.env.SECRET_KEY;

  return jwt.sign(payload, secret, { expiresIn: "24h" });
}

module.exports = new AuthController();
