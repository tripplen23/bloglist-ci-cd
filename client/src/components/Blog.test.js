import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'https://www.frontendtest.com/',
    likes: 0,
    user: {
      username: 'binhfnef',
      name: 'binh',
    },
  };

  let component;
  const mockLikesHandler = jest.fn();
  beforeEach(() => {
    component = render(
      <Blog key={blog.id} blog={blog} updateLikes={mockLikesHandler} />
    );
  });

  test('Rendering title and author of each post but not url or likes by default', () => {
    expect(component.container.querySelector('.title')).toHaveTextContent(
      blog.title
    );
    expect(component.container.querySelector('.author')).toHaveTextContent(
      blog.author
    );

    expect(component.queryByText(blog.url)).not.toBeInTheDocument();
    expect(component.queryByText('like')).not.toBeInTheDocument();
    screen.debug();
  });

  test('Rendering URL and number of likes when view button is clicked', async () => {
    const viewButton = component.container.querySelector('.view-btn');
    await userEvent.click(viewButton);

    expect(component.queryByText(blog.url)).toBeInTheDocument();
    expect(component.queryByText('like')).toBeInTheDocument();

    screen.debug();
  });

  test('If the like button is clicked twice, the event handler is called twice', async () => {
    const viewButton = component.queryByText('show');
    await userEvent.click(viewButton);

    const likeButton = component.container.querySelector('.like-btn');
    await userEvent.click(likeButton);
    await userEvent.click(likeButton);

    expect(mockLikesHandler.mock.calls).toHaveLength(2);
  });
});
