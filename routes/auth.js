const router = require("express").Router();
const prisma = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerValidation, loginValidation } = require("../validations");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExists = await prisma.user.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (emailExists) return res.status(400).send("Email already exists..");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = await prisma.user.create({
    data: { ...req.body, password: hashedPassword },
  });

  res.json({ user: user.id });
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await prisma.user.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!user) return res.status(400).send("Email doesn't exist.");

  const validPass = await bcrypt.compare(req.body.password, user.password);

  if (!validPass) {
    return res.status(400).send("Invalid Password.");
  }
  const token = jwt.sign({ id: user.id }, process.env.SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
