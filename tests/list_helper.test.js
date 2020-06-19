const listHelper = require('../utils/list_helper');
const testHelper = require('./test_helper');

// Test Data
const listWithManyBlogs = testHelper.initialBlogs;
const listWithOneBlog = [listWithManyBlogs[0]];

describe('total likes', () => {
  test('when list has only one blog post equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(7);
  });

  test('when list has many blogs', () => {
    const result = listHelper.totalLikes(listWithManyBlogs);
    expect(result).toBe(36);
  });

  test('when list is empty', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });
});

describe('most liked blog', () => {
  test('when blog is empty', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(0);
  });

  test('when list only has one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    const exResult = { author: 'Michael Chan', likes: 7, title: 'React patterns' };
    expect(result).toEqual(exResult);
  });

  test('when list has many blogs', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs);
    const exResult = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };

    expect(result).toEqual(exResult);
  });
});

describe('most blogs', () => {
  test('when list has  many blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs);
    const exResult = { author: 'Robert C. Martin', blogs: 3 };
    expect(result).toEqual(exResult);
  });

  test('empty list', () => {
    const result = listHelper.mostBlogs([]);
    const exResult = { author: null, blogs: 0 };
    expect(result).toEqual(exResult);
  });
});

describe('most likes', () => {
  test('when list has many blogs', () => {
    const result = listHelper.mostLikes(listWithManyBlogs);
    const exResult = { author: 'Edsger W. Dijkstra', likes: 17 };
    expect(result).toEqual(exResult);
  });

  test('empty list', () => {
    const result = listHelper.mostLikes([]);
    const exResult = { author: null, likes: 0 };
    expect(result).toEqual(exResult);
  });
});
