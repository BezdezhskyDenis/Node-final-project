const { User, validateUser } = require("../models/users.model");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { errorLog } = require("../utils/chalk.log");

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -isAdmin"
    );
    if (!user) {
      return res.status(400).send("User with the given ID was not found.");
    }
    res.json(user);
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function getAllUsers(req, res) {
  try {
    if (!req.user.isAdmin) return res.status(403).send("Unauthorized");
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
}

async function addNewUser(req, res) {
  try {
    const { error } = validateUser(req.body, req.method);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already registered");
    }

    if (!req.body.image.url) {
      req.body.image.url =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    }

    if (!req.body.image.alt) {
      req.body.image.alt = "default";
    }

    const newUser = new User({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 12),
    });
    await newUser.save();

    res.json(_.pick(newUser, ["name", "email", "_id"]));
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function editUser(req, res) {
  try {
    const { error } = validateUser(req.body, req.method);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(400).send("The User with the given ID was not found");
    }

    res.json(_.pick(user, ["name", "email", "_id"]));
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function releaseUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        loginAttempts: 0,
        lockUntil: null,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(400).send("The User with the given ID was not found");
    }
    res
      .status(200)
      .send(`user with ID: ${req.params.id} was released successfully`);
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function updateUserParams(req, res) {
  try {
    let updateObj = {};
    let objKeys = [];
    for (const key in req.body) {
      if (req.body[key] !== undefined) updateObj[key] = req.body[key];
      objKeys.push(key);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
    if (!user) {
      return res.status(400).send("The User with the given ID was not found");
    }
    res.json(_.pick(user, ["name", "email", "_id", ...objKeys]));
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function toggleBusinessStatus(req, res) {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).send("The User with the given ID was not found");
    }
    user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isBusiness: !user.isBusiness,
      },
      { new: true }
    );
    res.json(_.pick(user, ["name", "email", "_id", "isBusiness"]));
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(400)
        .send("The user with the provided id was not found.");
    }
    res.json({
      message: `User ${user.name?.first} ${user.name?.last} has been deleted.`,
    });
  } catch (error) {
    errorLog(error);
    res.status(500).send("An error occurred, Error: " + error.message);
  }
}

module.exports = {
  getUserById,
  getAllUsers,
  addNewUser,
  editUser,
  releaseUser,
  updateUserParams,
  toggleBusinessStatus,
  deleteUser,
};
