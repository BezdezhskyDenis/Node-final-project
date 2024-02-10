const { Card, checkValidId } = require("../models/cards.model");

async function cardVerify(req, res, next) {

  if (!checkValidId(req.params.id)) {
    res.status(400).send(`${req.params.id} is not a valid ID`);
    return;
  }
  const card = await Card.findOne({ _id: req.params.id });

  if (!card) {
    res.status(400).send("The card with the given ID was not found");
    return;
  }

  if (!req.user.isAdmin) {
    if (req.user._id !== card.user_id) {
      console.log(req.method);
      switch (req.method) {
        case `GET`:
          res.status(403).send("You can only view your'e own Card's");
          return;
        case `PUT`:
          res.status(403).send("You can only change your'e own Card's");
          return;
        case "DELETE":
          res.status(403).send("You can only delete your'e own Card's");
          return;
      }
    }
  }

  next();
}

module.exports = {
  cardVerify,
};
