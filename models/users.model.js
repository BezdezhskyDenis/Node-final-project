const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const nameSchema = require("./schemas/name.schema");
const addressSchema = require("./schemas/address.schema");
const imageSchema = require("./schemas/image.schema")

const userSchema = new mongoose.Schema(
  {
    name: nameSchema,
    address: addressSchema,
    image: imageSchema,
    isBusiness: {
      type: Boolean,
      require: true,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      match: RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/),
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 256,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      maxlength: 1024,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    methods: {
      generateAuthToken() {
        return jwt.sign(
          { _id: this._id, isBusiness: this.isBusiness, isAdmin: this.isAdmin },
          process.env.JWT_SIGNATURE
        );
      },
    },
  }
);

const User = mongoose.model("User", userSchema, "users");

function validateUser(user, requestMethod) {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(256).required(),
      middle: Joi.string().min(2).max(256).allow(""),
      last: Joi.string().min(2).max(256).required(),
    }).required(),
    image: Joi.object({
      url: Joi.string().uri().allow(""),
      alt: Joi.string().min(2).max(256).allow(""),
    }).allow({}),
    phone: Joi.string()
      .pattern(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
      .message("user phone mast be a valid phone number")
      .required(),
    email: Joi.string()
      .min(5)
      .max(256)
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string()
      .min(7)
      .max(20)
      .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/)
      .message(
        "Password must be at least 7 characters long, contain at least one uppercase letter, and include one of the following special characters: !@#$%^&*"
      )
      .when(requestMethod, {
        is: "POST",
        then: Joi.required(),
      }),
    address: Joi.object({
      state: Joi.string().min(2).max(256).allow(""),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().min(1).max(256).required(),
      zip: Joi.number().min(2).max(256).required(),
    }).required(),
    isBusiness: Joi.boolean().required(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
}

function checkValidId(id) {
  return mongoose.isValidObjectId(id);
}

module.exports = {
  User,
  validateUser,
  checkValidId,
};
