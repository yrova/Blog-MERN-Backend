const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({ username: 'root', name: 'Avory Richie', password: 'secret' });
    await user.save();
  });

  test('creation succeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'yrova',
      name: 'Avory Richie',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails if username and/or password is not given', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserOne = { name: 'Coco Chanel', password: 'Coco' };
    const newUserTwo = { username: 'Coach', name: 'Coco Chanel' };

    await api
      .post('/api/users')
      .send(newUserOne)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    await api
      .post('/api/users')
      .send(newUserTwo)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });

  test('creation fails with proper status code and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Avory Richie',
      password: 'password',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });
});

describe('Login Tests', () => {
  beforeEach(async () => {
    const newUser = {
      username: 'yrova',
      name: 'Avory Richie',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser);
  });

  test('Wrong password on login error code', async () => {
    await api
      .post('/api/login')
      .send({ username: 'yrova', password: 'as' })
      .expect(401);
  });

  test('Wrong username on login error code', async () => {
    await api
      .post('/api/login')
      .send({ username: 'wow', password: 'password' })
      .expect(401);
  });

  test('succesful login', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'yrova', password: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.token).toBeDefined();
    expect(result.body.username).toBe('yrova');
    expect(result.body.name).toBe('Avory Richie');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
