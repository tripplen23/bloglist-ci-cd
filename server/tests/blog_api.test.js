const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
}, 100000)

// TODO: Test GET method in api /api/blogs
describe('(200) When there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('(200) Get all blogs in the database', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('A specific blog within the initial database', async () => {
    const blogs = await api.get('/api/blogs')
    const blogTitle = blogs.body.map((blog) => blog.title)
    expect(blogTitle).toContain('Golang is amazing')
  })

  test('Unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})

// TODO: Test GET method in api /api/blogs/:id
describe('Viewing the specific blog', () => {
  test('(200) Get a specific blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
    expect(resultBlog.body.title).toContain('Javascript is fun')
  })

  test('(404) the blog dose not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
  })

  test('(400) id is invalid', async () => {
    const inValidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/blogs/${inValidId}`).expect(400)
  })
})

// TODO: Test POST method in api /api/blogs
describe('Addition of a new blog', () => {
  let token = null
  beforeAll(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    // TODO: Login user to get the token
    await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret',
      })
      .then((response) => {
        return (token = response.body.token)
      })

    return token
  }, 100000)

  test('(201) Create a new blog into the database by the authorized user', async () => {
    const newBlog = {
      title: 'Python is amazing',
      author: 'Binh Nguyen',
      url: 'https://github.com',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map((blog) => blog.title)
    expect(contents).toContain('Python is amazing')
  })

  test('(201) Create a blog with the default like as 0 (not include likes in the request', async () => {
    const newBlog = {
      _id: '644b46cd041cc4325aea2720',
      title: 'Java is lengendary',
      author: 'Binh Nguyen',
      url: 'https://github.com',
      __v: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map((blog) => blog.title)
    expect(contents).toContain('Java is lengendary')

    const likesOfAddedBlog = blogsAtEnd[helper.initialBlogs.length]
    expect(likesOfAddedBlog.likes).toBe(0)
  })

  test('(400) Blog schema without URL is not added', async () => {
    const newBlog = {
      _id: '644b46cd041cc4325aea2719',
      title: 'C++ is fascinating',
      author: 'Binh Nguyen',
      __v: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('(401) Add a blog but with unauthorized token', async () => {
    const newBlog = {
      title: 'Python is amazing',
      author: 'Binh Nguyen',
      url: 'https://github.com',
    }

    token = null

    await api
      .post('/api/blogs')
      .set('Authorization', `${token}`)
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('(400) Add a blog but with invalid token', async () => {
    const newBlog = {
      title: 'Python is amazing',
      author: 'Binh Nguyen',
      url: 'https://github.com',
    }

    token = null

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

// TODO: Test DELETE method in api /api/blogs/:id
describe('Deletion of a blog', () => {
  let token = null
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    // TODO: Login user to get the token
    await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret',
      })
      .then((response) => {
        return (token = response.body.token)
      })

    const newBlog = {
      title: 'Python is amazing',
      author: 'Binh Nguyen',
      url: 'https://github.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    return token
  }, 1000000)

  test('(204) Succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await Blog.find({}).populate('user')

    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({}).populate('user')

    expect(blogsAtStart).toHaveLength(1)
    expect(blogsAtEnd).toHaveLength(0)
    expect(blogsAtEnd).toEqual([])
  })

  test('(400) JWT malformed', async () => {
    const blogsAtStart = await Blog.find({}).populate('user')

    const blogToDelete = blogsAtStart[0]

    token = null

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Beaerer ${token}`)
      .expect(400)

    const blogsAtEnd = await Blog.find({}).populate('user')

    expect(blogsAtStart).toHaveLength(1)
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(blogsAtEnd).toEqual(blogsAtStart)
  })
})

// TODO: Test PUT method in api /api/blogs/:id
describe('Update of a blog', () => {
  test('(200) Update likes number of a blog successfully', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 20 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const content = blogsAtEnd[0]
    expect(content.likes).toBe(20)
  })

  test('(404) The blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send({ likes: 20 })
      .expect(404)
  })

  test('(400) The blog id is invalid', async () => {
    const invalidId = '12312312'

    await api.put(`/api/blogs/${invalidId}`).send({ likes: 20 }).expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
