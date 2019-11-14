const express = require("express");
const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", (req, res) => {
  db.select("*")
    .from("accounts")
    .then(accts => {
      res.status(200).json(accts);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving accounts", err });
    });
});

router.get("/:id", validateID, (req, res) => {
  const id = req.params.id;
  db.select("*")
    .from("accounts")
    .where({ id })
    .then(acct => {
      res.status(200).json(acct);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving account", err });
    });
});

router.post("/", validateBody, validateAccountKeys, (req, res) => {
  const bodyInfo = req.body;

  db.insert(bodyInfo)
    .into("accounts")
    .then(acct => {
      res.status(201).json(acct);
    })
    .catch(err => {
      res.status(500).json({ message: "Error adding new account", err });
    });
});

router.put(
  "/:id",
  validateID,
  validateBody,
  validateAccountKeys,
  (req, res) => {
    const id = req.params.id;
    const bodyInfo = req.body;

    db("accounts")
      .where({ id })
      .update(bodyInfo)
      .then(acct => {
        res.status(200).json(acct);
      })
      .catch(err => {
        res.status(500).json({ message: "Error updating account", err });
      });
  }
);

router.delete("/:id", validateID, (req, res) => {
  const id = req.params.id;

  db.del()
    .from("accounts")
    .where({ id })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      res.status(500).json({ message: "Error deleting account", err });
    });
});

// doot doot magic floot
// middleware lives here
// these comments are just creating space
// a beautiful wall, that really works
// in colorado

function validateID(req, res, next) {
  const id = req.params.id;
  db.select("*")
    .from("accounts")
    .where({ id })
    .then(acct => {
      acct[0]
        ? next()
        : res.status(404).json({
            message: `Account with ID ${req.params.id} can't be found`
          });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Error validating account ID to be returned", err });
    });
}

function validateBody(req, res, next) {
  const bodyInfo = req.body;

  Object.keys(bodyInfo).length > 0
    ? next()
    : res.status(400).json({ message: "Missing request body" });
}

function validateAccountKeys(req, res, next) {
  const bodyInfo = req.body;

  bodyInfo.name && bodyInfo.budget
    ? next()
    : res
        .status(400)
        .json({ message: "Request body missing name or budget key" });
}

module.exports = router;
