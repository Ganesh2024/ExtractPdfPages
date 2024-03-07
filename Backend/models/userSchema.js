const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, sparse: true },
    password: { type: String, required: true,},
    token: { type: String },
    files:[{
      name: String, //change to name
      title: String,
      downloadURL : String,
    }]
  }, 
  { timestamps: true }
)

const User = mongoose.model("User", userSchema);

module.exports = { User };