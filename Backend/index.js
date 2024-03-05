const express = require('express');
const cors = require("cors");
const connect = require("./config/db");
require("dotenv").config();
const { User } = require("./models/userSchema");
const {login,register} = require("./controllers/controller");
const multer = require("multer");
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

connect();

app.use("/files", express.static("files"));
app.use(express.json());

app.post("/login",login);
app.post("/register",register);


const pdfstorage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"./files");
  },
  filename: function(req,file,cb){
    cb(null,Date.now()+ "-" + file.originalname);
  }
})

const upload = multer({
  storage: pdfstorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) { 
      // upload only png and jpg format
      return cb(new Error('Please upload a Image'))
    }
    cb(undefined, true)
  }
});

app.post("/pdfList",async (req,res)=>{
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
      files : olduser.files,
    });

  } catch (err) {
    console.log(err);
  }
})

app.post("/uploadPdf", upload.single("file"), async (req, res) => {
  try {
    const title = req.body.title;
    const filename = req.file.filename;
    const userId = req.body.userId;

    // Validate userId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ error: 'Invalid userId' });
    }

    const olduser = await User.findById(userId);
    if (!olduser) {
      return res.status(404).send({ error: 'User not found' });
    }

    olduser.files.push({
      filename: filename,
      title: title
    });

    await olduser.save();
    res.send({
      msg: "File uploaded successfully",
      status: 200,
      filename: filename,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get("/getFiles", async (req, res) => {
  try {
    const userId = req.query.userId; 
    const files = await User.findById(userId).select("files"); 
    res.send({ status: 200, files: files });

  } catch (err) {
    console.log(err);
  }
});


app.get("/", (req, res) => {
  res.send({ status: 400, msg: "success" });
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT} 🔥`);
});
