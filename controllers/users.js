/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {
      title: 1, url: 1, likes: 1, id: 1,
    });

  response.json(users.map((u) => u.toJSON()));
});

usersRouter.post('/', async (request, response) => {
  const { body } = request;

  if (body.password === undefined) {
    return response.status(400).json({ error: 'Validation Error', message: 'Must provide password' });
  }

  if (body.password.length < 3) {
    return response.status(400).json({ error: 'Validation Error', message: 'Password must be longer than 2 characters' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;
