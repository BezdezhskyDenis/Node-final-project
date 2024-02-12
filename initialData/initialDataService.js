const { users, cards } = require("./initialData.json");
const { User } = require("../models/users.model");
const { Card } = require("../models/cards.model");
const mongoose = require("mongoose");
const _ = require("lodash");
const {
  errorLog,
  warningLog,
  successLog,
  infoLog,
  separateLine,
} = require("../utils/chalk.log");
const bcrypt = require("bcrypt");

if (require.main === module) {
  require("../configs/loadEnvs");

  require("../db/dbService")
    .connect()
    .then(() => seed());
}

async function seed() {
  try {
    separateLine();
    infoLog("Checking DataBase for existing data");
    const existingUsersCount = await User.countDocuments();
    const existingCardsCount = await Card.countDocuments();

    if (existingUsersCount > 0 || existingCardsCount > 0) {
      successLog(
        "The users and cards already exist, skipping the seeding process."
      );
      separateLine();
      return;
    }
    warningLog("Starting Seeding initial Data");
    warningLog("Seeding initial Users");
    await generateUsers();
    successLog("Seeding initial Users complete");

    const firstBusinessUser = await User.findOne({ isBusiness: true });
    if (firstBusinessUser) {
      warningLog("Seeding initial Cards");
      await generateCards(firstBusinessUser._id.toString());
      successLog("Seeding initial Cards complete");
    }

    successLog("Initial Users and Cards seed complete successfully");
    separateLine();
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function generateUsers() {
  const Ps = [];
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    const newUser = await new User(user).save();
    Ps.push(newUser);
  }

  return await Promise.all(Ps);
}
async function generateCards(user_id) {
  const Ps = [];
  for (const card of cards) {
    card.user_id = user_id;
    const newCard = await new Card(card).save();
    Ps.push(newCard);
  }

  return await Promise.all(Ps);
}
module.exports = { seed };
