const {
  validateCard,
  Card,
  generateBizNumber,
  checkValidId,
} = require("../models/cards.model");

const { errorLog } = require("../utils/chalk.log");

async function createNewCard(req, res) {
  try {
    if (req.user.isBusiness === false) {
      return res
        .status(401)
        .send("User must be a Business account to create card's");
    }
    const { error } = validateCard(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    if (!req.body.image.url) {
      req.body.image.url =
        "https://img.izismile.com/img/img13/20201030/640/you_have_never_seen_something_like_this_640_36.jpg";
    }

    if (!req.body.image.alt) {
      req.body.image.alt = "default";
    }

    const card = new Card({
      ...req.body,
      bizNumber: await generateBizNumber(),
      user_id: req.user._id,
    });
    await card.save();
    res.json(card);
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function getAllCards(req, res) {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    errorLog(err);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function getCardsByUserId(req, res) {
  try {
    const cards = await Card.find({
      user_id: req.user._id,
    });

    if (!cards || cards.length == 0) {
      return res.status(400).send(`No card's found for user: ${req.user._id}`);
    }
    res.json(cards);
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function getCardById(req, res) {
  try {
    if (!checkValidId(req.params.id)) {
      return res.status(400).send(`${req.params.id} is not a valid ID`);
    }
    const card = await Card.findOne({
      _id: req.params.id,
    });
    if (!card) {
      return res.status(400).send("The card with the ID number was not found");
    }
    res.json(card);
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function editCard(req, res) {
  try {
    const { error } = validateCard(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const card = await Card.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true }
    );
    if (!card) {
      return res.status(400).send("The card with the given ID was not found");
    }
    res.json(card);
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function deleteCard(req, res) {
  try {
    const card = await Card.findOneAndDelete({
      _id: req.params.id,
    });
    if (!card) {
      return res.status(400).send("The card with the given ID was not found");
    }
    res.json({
      message: `Card number:${card.bizNumber} has been deleted.`,
    });
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function toggleLike(req, res) {
  try {
    if (!req.user.isBusiness) {
      return res.status(401).send("Only Business user's can like cards");
    }
    let card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(400).send("The User with the given ID was not found");
    }

    card = await card.toggleLikeCard(req.user._id);
    res.json(card);
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function changeBusinessNumber(req, res) {
  try {
    const newBusinessNumber = req.body.bizNumber.toString();
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .send("Access denied. Only admins can perform this action.");
    }
    if (newBusinessNumber.length < 3 && newBusinessNumber.length > 12) {
      return res.status(400).send("The business number must be between 3 and 12 digits.");
    }
    const existingCard = await Card.findOne({ bizNumber: newBusinessNumber });
    if (existingCard) {
      return res.status(400).send("The business number is already taken.");
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { bizNumber: newBusinessNumber },
      { new: true }
    );
    if (!updatedCard) {
      return res.status(404).send("Card not found.");
    }

    res.send(updatedCard);
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

module.exports = {
  createNewCard,
  getAllCards,
  getCardsByUserId,
  getCardById,
  editCard,
  deleteCard,
  toggleLike,
  changeBusinessNumber,
};
