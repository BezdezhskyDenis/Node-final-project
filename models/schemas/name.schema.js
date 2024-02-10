const mongoose = require("mongoose");

const nameSchema = new mongoose.Schema({
  first: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
    trim: true,
  },
  middle: {
    type: String,
    maxlength: 256,
    trim: true,
    default: "",
  },
  last: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
    trim: true,
  },
});

module.exports = nameSchema;
