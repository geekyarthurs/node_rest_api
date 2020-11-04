const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const verifyToken = require("../verifyToken");
const prisma = require("../db");

router.use(verifyToken);

router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const post = await prisma.post.create({
    data: req.body,
  });
  res.json(post);
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await prisma.post.findOne({
    where: {
      id: Number(postId),
    },
  });
  res.json(post);
});

router.delete("/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await prisma.post.delete({
    where: { id: Number(postId) },
  });
  res.json(post);
});

module.exports = router;
