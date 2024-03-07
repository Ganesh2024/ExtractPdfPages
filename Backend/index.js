

const express = require('express');
const cors = require("cors");
const connect = require("./config/db");
require("dotenv").config();
const { User } = require("./models/userSchema");
const { login, register } = require("./controllers/controller");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require("multer");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

connect();

app.use(express.json());

app.post("/login", login);
app.post("/register", register);

const pdfstorage = multer.memoryStorage();

const upload = multer({
  storage: pdfstorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Please upload a PDF file'));
    }
    cb(null, true);
  }
}).single("file");

app.post("/pdfList", async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ error: 'Invalid userId' });
    }

    const olduser = await User.findById(userId);
    if (!olduser) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send({
      msg: "sent all files",
      status: 200,
      files: olduser.files,
    });

  } catch (err) {
    console.log(err);
  }
});

app.post("/uploadPdf", async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).send({ error: err.message });
      }

      const userId = req.body.userId;
      const title = req.body.title;
      const name = req.body.name;
      const downloadURL = req.body.downloadURL;


      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).send({ error: 'Invalid userId' });
      }

      const olduser = await User.findById(userId);
      if (!olduser) {
        return res.status(404).send({ error: 'User not found' });
      }

      olduser.files.push({
        name: name,
        title: title,
        downloadURL: downloadURL,
      });

      // console.log(olduser.files);

      await olduser.save();
      res.send({
        msg: "File uploaded successfully",
        status: 200,
        name: name,
        downloadURL: downloadURL,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send({ status: 400, msg: "success" });
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT} 🔥`);
});
