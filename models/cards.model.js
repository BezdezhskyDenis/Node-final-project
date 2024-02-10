const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");

const addressSchema = require("./schemas/address.schema");
const imageSchema = require("./schemas/image.schema")

const cardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 11,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
  },
  web: {
    type: String,
    minlength: 10,
  },
  image: imageSchema,
  address: addressSchema,
  bizNumber: {
    type: Number,
    required: true,
    minlength: 3,
    maxlength: 12,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  likes: {
    type: Array
  },
},
{
  methods: {
    toggleLikeCard(user_id) {
      if (this.likes.includes(user_id)) {
        this.likes = this.likes.filter((uid)=> uid !== user_id);
        } else {
          this.likes.push(user_id);
          };
          return this.save();
          },
    },
  },
);

const Card = mongoose.model("Card", cardsSchema, "cards");

function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
      subtitle: Joi.string().min(2).max(256).required(),
      description: Joi.string().min(2).max(1024).required(),
      phone: Joi.string().min(9).max(11).required(),
      email: Joi.string()
        .min(5)
        .required()
        .email({ tlds: { allow: false } }),
      web: Joi.string().min(10).allow(""),
      image: Joi.object({
        url: Joi.string().min(14).allow(""),
        alt: Joi.string().min(2).max(256).allow(""),
      }).required(),
      address: Joi.object({
        state: Joi.string().allow(""),
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        houseNumber: Joi.number().min(1).required(),
        zip: Joi.number().allow(""),
      }).required(),
    })

  return schema.validate(card);
}

async function generateBizNumber() {
  while (true) {
    const randomNumber = _.random(100, 999_999_999_999);
    const card = await Card.findOne({ bizNumber: randomNumber });
    if (!card) {
      return String(randomNumber);
    }
  }
}

function checkValidId(id) {
  return mongoose.isValidObjectId(id)
}

module.exports = {
  Card,
  validateCard,
  generateBizNumber,
  checkValidId,
};
