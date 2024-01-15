const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '644b46cd041cc4325aea2729',
    title: 'Javascript is fun',
    author: 'Binh Nguyen',
    url: 'https://github.com',
    likes: 2,
    __v: 0,
  },
  {
    _id: '644b46cd041cc4325aea2726',
    title: 'Golang is amazing',
    author: 'Binh Nguyen',
    url: 'https://github.com',
    likes: 5,
    __v: 0,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'Binh Nguyen',
    url: 'https://github.com',
    likes: 5,
    __v: 0,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  nonExistingId,
}
