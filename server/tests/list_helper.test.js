const listHelper = require('../utils/list_helper')

const noBlogs = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
]

const listWithMultipleBlog = [
  {
    _id: '5a422aa71b54a676234d17f2',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f3',
    title: 'Testing with Jest',
    author: 'Binh Nguyen',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f4',
    title: 'Github 101',
    author: 'Binh Nguyen',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 11,
    __v: 0,
  },
]

describe('dummy', () => {
  test('dummy returns one', () => {
    const result = listHelper.dummy(noBlogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('total likes in a empty list of blog', () => {
    const result = listHelper.totalLikes(noBlogs)
    expect(result).toBe(0)
  })

  test('total likes in a list of blogs', () => {
    const result = listHelper.totalLikes(listWithMultipleBlog)
    expect(result).toBe(33)
  })

  test('total likes in a list of 1 blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})

describe('favourite blog', () => {
  test('favourite blog in a empty list of blog', () => {
    const result = listHelper.favoriteBlog(noBlogs)
    expect(result).toEqual(null)
  })

  test('favorite blog in a list of blogs', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlog)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })

  test('favorite blog in a list of 1 blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })
})

describe('most blogs author ', () => {
  test('most blogs author in a empty list of blog', () => {
    const result = listHelper.mostBlogs(noBlogs)
    expect(result).toEqual(null)
  })

  test('most blogs author in a list of blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlog)
    expect(result).toEqual({
      author: 'Binh Nguyen',
      blogs: 2,
    })
  })

  test('most blogs author in a list of 1 blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    })
  })
})

describe('most likes author ', () => {
  test('most likes author in a empty list of blog', () => {
    const result = listHelper.mostLikes(noBlogs)
    expect(result).toEqual(null)
  })

  test('most likes author in a list of blogs', () => {
    const result = listHelper.mostLikes(listWithMultipleBlog)
    expect(result).toEqual({
      author: 'Binh Nguyen',
      likes: 21,
    })
  })

  test('most likes author in a list of 1 blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })
})
