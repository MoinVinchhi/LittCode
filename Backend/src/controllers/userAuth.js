const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validators");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Submission = require("../models/submission");

const register = async (req, res) => {
  try {
    //validate the data
    validate(req.body);

    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";

    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1hr" }
    );
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true, // prevent JS access
      secure: true, // needed for HTTPS
      sameSite: "None", // allow cross-site cookies
    });

    const reply = {
      _id: user._id,
      firstName: user.firstName,
      emailId: user.emailId,
      role: user.role,
    };

    res.status(201).json({
      user: reply,
      message: "User Registered Successfully",
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId });

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error("Invalid Credentials");
        
    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1hr" }
    );
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true, // prevent JS access
      secure: true, // needed for HTTPS
      sameSite: "None", // allow cross-site cookies
    });

    const reply = {
      _id: user._id,
      firstName: user.firstName,
      emailId: user.emailId,
      role: user.role,
    };

    res.status(201).json({
      user: reply,
      message: "User Logged In Successfully",
    });
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.send("User Logged Out Successfully");
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

const adminRegister = async (req, res) => {
  try {
    // if (req.data.role != 'admin')
    //     throw new Error('Invalid Credentials');

    validate(req.body);

    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);

    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1hr" }
    );
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true, // prevent JS access
      secure: true, // needed for HTTPS
      sameSite: "None", // allow cross-site cookies
    });

    res.status(201).send("User Registered Successfully");
  } catch (err) {
    res.status(400).send("Error(adminreg): " + err.message);
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.data._id;

    //user schema
    await User.findByIdAndDelete(userId);

    //submission schema
    await Submission.deleteMany({ userId });

    res.status(200).send("Deleted Successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error: " + err.message);
  }
};

module.exports = { register, login, logout, adminRegister, deleteProfile };
