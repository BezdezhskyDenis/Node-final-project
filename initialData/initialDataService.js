const { users, cards } = require("./initialData.json");
const { User } = require("../models/users.model");
const { Card } = require("../models/cards.model");
const _ = require("lodash");
const {
  errorLog,
  warningLog,
  successLog,
  infoLog,
  separateLine
} = require("../utils/chalk.log");
const bcrypt = require("bcrypt");

if (require.main === module) {
  require("../configs/loadEnvs");

  require("../db/dbService")
    .connect()
    .then(() => seed());
}

async function seed() {
  separateLine()
  infoLog("Checking DataBase for existing data");
  const existingUsersCount = await User.countDocuments();
  const existingCardsCount = await Card.countDocuments();

  if (existingUsersCount > 0 || existingCardsCount > 0) {
    successLog(
      "The users and cards already exist, skipping the seeding process."
    );
    separateLine()
    return;
  }
  warningLog("Start Seeding initial Users and Cards");
  const createdUsers = await generateUsers();

  const firstBusinessUser = createdUsers.find((user) => user.isBusiness);

  if (firstBusinessUser) {
    await generateCards(firstBusinessUser._id);
  }

  warningLog("Initial Users and Cards seed complete successfully");
  separateLine()
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
    const newCard = await new Card(card).save();
    newCard.user_id = user_id;
    Ps.push(newCard);
  }

  return await Promise.all(Ps);
}
module.exports = { seed };
