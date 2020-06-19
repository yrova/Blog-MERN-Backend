/**
 * Returns total sum of likes in all blog posts.
 * @param {array} blogs
 * @return {number}
 */
const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes;

  return blogs.reduce(reducer, 0);
};

/**
 * Finds out which blog has the most likes
 * @param {array} blogs
 * @return {object} {title, author, likes}
 */
const favoriteBlog = (blogs) => {
  if (blogs.length < 1) return 0; // return 0 if list is empty
  const reducer = (prev, cur) => {
    if (prev != null && prev.likes >= cur.likes) {
      return prev;
    }

    return cur;
  };

  const mostLikedBlog = blogs.reduce(reducer, null);
  const { title, author, likes } = mostLikedBlog;
  const subset = { title, author, likes };
  return subset;
};

/**
 * Returns the author who has the largest amount of blogs.
 * The return value also contains the number of blogs the top author has
 * @param {array} blogs
 * @return {object} {author, blogs}
 */
const mostBlogs = (blogs) => {
  // Creates HashMap with authors as the key and number of blogs as the value
  const hashMap = new Map();
  blogs.forEach((blog) => {
    if (!hashMap.has(blog.author)) {
      hashMap.set(blog.author, 1);
    } else {
      hashMap.set(blog.author, hashMap.get(blog.author) + 1);
    }
  });

  // Create custom object for output
  const output = {
    author: null,
    blogs: 0,
  };

  hashMap.forEach((value, key) => {
    if (output.author === null || output.blogs < value) {
      output.author = key;
      output.blogs = value;
    }
  });

  return output;
};

/**
 * Returns the author who has the largest amount of likes in total.
 * The return value also contains the number of likes the author has
 * @param {array} blogs
 * @return {object} {author, likes}
 */
const mostLikes = (blogs) => {
  // Creates HashMap with authors as the key and number of likes as the value
  const hashMap = new Map();
  blogs.forEach((blog) => {
    if (!hashMap.has(blog.author)) {
      hashMap.set(blog.author, blog.likes);
    } else {
      hashMap.set(blog.author, hashMap.get(blog.author) + blog.likes); // sum likes
    }
  });

  // Create custom object for output and set author with most likes
  const output = {
    author: null,
    likes: 0,
  };

  hashMap.forEach((value, key) => {
    if (output.author === null || output.likes < value) {
      output.author = key;
      output.likes = value;
    }
  });

  return output;
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
