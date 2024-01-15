const _ = require('lodash')

const dummy = (blogs) => {
  blogs = 1
  return blogs
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((total, currentValue) => {
    return total + currentValue.likes
  }, 0)
  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let maxLikes = -1
  let favorite = null

  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > maxLikes) {
      maxLikes = blogs[i].likes
      favorite = blogs[i]
    }
  }

  // Return the most liked blog with the following definition
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  /*
   * Using the countBy method from the Lodash library,
   * the function creates an object blogCountByAuthor
   * that counts the number of blogs written by each author.
   */
  const blogCountByAuthor = _.countBy(blogs, 'author')

  // TODO: The maxBy method from Lodash library finds the author with the most blog posts
  const topAuthor = _.maxBy(
    _.keys(blogCountByAuthor),
    (author) => blogCountByAuthor[author]
  )

  return {
    author: topAuthor,
    blogs: blogCountByAuthor[topAuthor],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // TODO: store the total number of likes each author has received.
  const likesByAuthor = {}

  // TODO: loops through each blog in the input array
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i]

    // TODO: if the author of the blog is not already in the likesByAuthor object, the function initializes the author's likes to 0
    if (!likesByAuthor[blog.author]) {
      likesByAuthor[blog.author] = 0
    }

    // TODO: adds the number of likes of each blog to the author's total likes
    likesByAuthor[blog.author] += blog.likes
  }

  // TODO: finds the author with the most total likes
  const topAuthor = Object.keys(likesByAuthor).reduce((a, b) =>
    likesByAuthor[a] > likesByAuthor[b] ? a : b
  )

  return {
    author: topAuthor,
    likes: likesByAuthor[topAuthor],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
