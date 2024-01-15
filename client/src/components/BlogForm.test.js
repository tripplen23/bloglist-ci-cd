import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('Test that the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const mockCreateBlogHandler = jest.fn();

  const { container } = render(<BlogForm createBlog={mockCreateBlogHandler} />);

  const titleInput = container.querySelector('input[name="title"]');
  const authorInput = container.querySelector('input[name="author"]');
  const urlInput = container.querySelector('input[name="url"]');
  const createButton = screen.getByText('create');

  await userEvent.type(titleInput, 'Front-end testing is great!');
  await userEvent.type(authorInput, 'Binh Nguyen');
  await userEvent.type(urlInput, 'http://www.nothinghere.com');
  await userEvent.click(createButton);

  expect(mockCreateBlogHandler.mock.calls).toHaveLength(1);
  expect(mockCreateBlogHandler.mock.calls[0][0]).toBe(
    'Front-end testing is great!'
  );
  expect(mockCreateBlogHandler.mock.calls[0][1]).toBe('Binh Nguyen');
  expect(mockCreateBlogHandler.mock.calls[0][2]).toBe(
    'http://www.nothinghere.com'
  );

  screen.debug();
});
