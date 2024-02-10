const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  state: {
    type: String,
    maxLength: 256,
    trim: true,
    lowercase: true,
    default: "",
  },
  country: {
    type: String,
    minLength: 2,
    maxLength: 256,
    trim: true,
    lowercase: true,
    required: true,
  },
  city: {
    type: String,
    minLength: 2,
    maxLength: 256,
    trim: true,
    lowercase: true,
    required: true,
  },
  street: {
    type: String,
    minLength: 2,
    maxLength: 256,
    trim: true,
    lowercase: true,
    required: true,
  },
  houseNumber: {
    type: Number,
    required: true,
    trim: true,
    maxLength: 256,
  },
  zip: {
    type: Number,
    trim: true,
    maxLength: 20,
    default: 0,
  },
});

module.exports = addressSchema;
