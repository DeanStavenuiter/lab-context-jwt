const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.get("/", (req, res, next) => {
  res.json("All good in auth");
});

router.post("/signup", async (req, res) => {
  const salt = bcrypt.genSaltSync(13);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  try {
    await User.create({
      username: req.body.username,
      passwordHash: hashedPassword,
    });
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log("error creating a user", error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const matchedUser = await User.find({ username: req.body.username });
    if (matchedUser.length) {
      const currentUser = matchedUser[0];
      if (bcrypt.compareSync(req.body.password, currentUser.passwordHash)) {
        const authToken = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: { user: { username: currentUser.username } },
          },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
          }
        );
        res.json({ authToken, message: "Login was succesfull" });
      } else {
        res.status(403).json({ message: "Password is incorrect" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error logging in", error);
  }
});

router.post("/verify", isAuthenticated, (req, res, next) => {
  console.log(req.payload);
  if (req.payload) {
    res.json(req.payload.user);
  }
});

module.exports = router;
