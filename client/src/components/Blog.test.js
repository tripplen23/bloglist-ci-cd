import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, act } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import Blog from './Blog.js'

describe('<Blog />', () => {
  let component
  const blog = {
    author: 'Just me',
    title: 'Blog title',
    url: 'http://blog-title.com',
    likes: 0,
  }

  const user = {
    username: 'jane',
    name: 'Jane Doe',
  }

  const mockHandlerUpdate = jest.fn()
  const mockHandlerRemove = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog
        user={user}
        removeBlog={mockHandlerRemove}
        updateLike={mockHandlerUpdate}
        blog={blog}
      />,
    )
  })

  test('renders blog title and author, but not url and number of likes by default', () => {
    const defaultBlogContent = component.container.querySelector('.blog')
    const defaultHiddenContent = component.getByTestId('hidden-content')

    expect(component.container).toHaveTextContent(blog.title)
    expect(defaultBlogContent).not.toHaveStyle('display: none')
    expect(defaultBlogContent).toBeVisible()
    expect(defaultHiddenContent).toHaveClass('hide')
  })

  test('renders blog url and number of likes when view button is clicked', () => {
    const button = component.getByText('View')

    act(() => {
      fireEvent.click(button)
    })

    const revealedContent = component.getByTestId('hidden-content')
    const likes = component.container.querySelector('.likes')

    expect(revealedContent).not.toHaveStyle('display: none')
    expect(revealedContent).not.toHaveClass('hide')
    expect(revealedContent).toBeVisible()
    expect(component.container).toHaveTextContent('Likes')
    expect(likes).toHaveTextContent(blog.likes)
    expect(component.container).toHaveTextContent(blog.url)
  })

  test('clicking the like button twice calls event handler passed as a prop twice', () => {
    const button = component.getByText('Like')

    act(() => {
      fireEvent.click(button)
      fireEvent.click(button)
    })

    expect(mockHandlerUpdate.mock.calls).toHaveLength(2)
  })
})
