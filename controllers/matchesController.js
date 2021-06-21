const db = require("../models");

module.exports = {
    findAll: function(req, res) {
      db.Matches
        .find(req.query)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    findById: function(req, res) {
      db.Matches
        .findById(req.params.id)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    create: function(req, res) {
      db.Matches
        .create(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    update: function(req, res) {
      db.Matches
        .findOneAndUpdate({ _id: req.params.id }, req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    remove: function(req, res) {
      db.Matches
        .findById({ _id: req.params.id })
        .then(dbModel => dbModel.remove())
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },
    findUsersMatches: function(req, res) {
        db.Matches
          .find({ $or: [
              {item2Owner: req.params.id},
              {item1Owner: req.params.id},
          ]})
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
    },
    deleteMatchesForItem: function(req, res) {
      db.Matches
        .find({ $or: [
          {item1Id: req.params.id},
          {item2Id: req.params.id},
        ]})
        .then(dbModel => dbModel.forEach(match => match.remove()))
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    }
    
  };