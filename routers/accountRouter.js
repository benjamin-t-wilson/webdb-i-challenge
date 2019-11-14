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
        : res
            .status(404)
            .json({
              message: `Account with ID ${req.params.id} can't be found`
            });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Error validating account ID to be returned", err });
    });
}

module.exports = router;
