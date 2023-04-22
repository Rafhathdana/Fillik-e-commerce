const express = require("express");
const multer = require("multer");
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.array("images"), function (req, res) {
  console.log(req.files);
  res.send("Images uploaded!");
});
