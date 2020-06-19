const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blogs');

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogsObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArr = blogsObjects.map((blog) => blog.save());
    await Promise.all(promiseArr);
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body.length).toBe(helper.initialBlogs.length);
  });

  test('a specific author is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const authors = response.body.map((r) => r.author);
    expect(authors).toContain('Michael Chan');
  });
});

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404);
  });

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400);
  });
});

describe('addition of a new blog', () => {
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

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Cats are dope', author: 'Avory Richie', url: 'https://cat.com/', likes: 98,
    };

    const userLogin = await api
      .post('/api/login')
      .send({ username: 'yrova', password: 'password' });

    const { token } = userLogin.body;

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('Cats are dope');
  });

  test('blog without title is not added', async () => {
    const userLogin = await api
      .post('/api/login')
      .send({ username: 'yrova', password: 'password' });

    const { token } = userLogin.body;
    const newBlog = {
      author: 'Avory Richie', url: 'https://cat.com/', likes: 98,
    };

    const blogsAtStart = await helper.blogsInDb();

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd.length).toBe(blogsAtStart.length);
  });

  test('id instead of _id for properties', async () => {
    const response = await api.get('/api/blogs');
    const content = response.body;
    expect(content[0].id).toBeDefined();
  });

  test('If no "like" property is given, default to zero', async () => {
    const newBlog = {
      title: 'Felines are dope', author: 'Melanie Tam', url: 'https://catParty.com/',
    };

    const userLogin = await api
      .post('/api/login')
      .send({ username: 'yrova', password: 'password' });

    const { token } = userLogin.body;

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.filter((blog) => blog.title === 'Felines are dope');
    expect(addedBlog[0].likes).toBe(0);
  });

  test('Blog without title and url is not added. 400', async () => {
    const userLogin = await api
      .post('/api/login')
      .send({ username: 'yrova', password: 'password' });

    const { token } = userLogin.body;

    const newBlog = {
      author: 'Avory Richie',
    };

    const blogsAtStart = await helper.blogsInDb();

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd.length).toBe(blogsAtStart.length);
  });
});


afterAll(() => {
  mongoose.connection.close();
});
