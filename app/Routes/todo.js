const express = require('express');
const todoRoutes = express.Router();
const user = require('../models/user');
const verifyToken = require('./verifyToken');

// get all todos

todoRoutes.get('/all', verifyToken, (req, res) => {
  user.findById(req.userId, 'todos -_id', (err, todos) => {
    if(err) return res.status(500).send({message: 'internal error'});
    res.status(200).send(todos.toJSON());
  });
});

// add todo

todoRoutes.post('/add', verifyToken, (req, res) => {
  user.findById(req.userId, (err, currUser) => {
    if (err) return res.status(500).send({message: 'internal error'});
    var subDoc = currUser.todos.create({name: req.body.name});
    currUser.todos.push(subDoc);
    currUser.save((err, updatedCurrUser) => {
      if (err) return res.status(500).send({message: 'internal error'});
      res.status(200).send(subDoc.toJSON());
    });
  });
});

// update a todo from done to undone or from undone to done

todoRoutes.post('/update', verifyToken, (req, res) => {
  const todoId = req.query.id;
  //res.sendStatus(200);
  user.findById(req.userId, (err, currUser) => {
    currUser.todos.id(req.body.id).done = req.body.done;
    currUser.save((err,currUser) => {
      if (err) return res.status(500).send({message: 'internal error'});
      res.sendStatus(200);
    });
  });
});

// delete a todo

todoRoutes.post('/delete', verifyToken, (req, res) => {
  user.findById(req.userId, (err, currUser) => {
    currUser.todos.id(req.body.id).remove();
    currUser.save((err) => {
      if (err) return res.status(500).send({message: 'internal error'});
      res.sendStatus(200);
    });
  });
});

module.exports = todoRoutes