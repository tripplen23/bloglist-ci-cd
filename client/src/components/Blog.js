import React from 'react';
import { useState } from 'react';
import blogService from '../services/blogs.js';

const Blog = ({ blog, updateLikes, deleteBlog, username }) => {
  // Style the blog
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const [visible, setVisible] = useState(false);

  const userId = blogService.getUserId();

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = () => {
    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };
    updateLikes(blog.id, blogToUpdate);
  };

  const handleDelete = () => {
    // Confirmation dialog for deleting
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  return (
    <div className='blog' style={blogStyle}>
      <div>
        <span className='title'>{blog.title} - </span>
        <span className='author'>{blog.author}</span>
        <button id='view-btn' onClick={toggleVisibility}>
          {visible ? 'hide' : 'show'}
        </button>
      </div>

      {/* Children prop */}
      {visible && (
        <div className='blog-details'>
          <div>{blog.url}</div>
          <div>
            likes: {blog.likes}{' '}
            <button id='like-btn' onClick={handleLike}>
              like
            </button>{' '}
          </div>
          {/* 5.8 Indicating the User information */}
          <div>UserID: {userId}</div>
          <div>UserName: {username}</div>
          {blog.user === userId && blog.user.username === username && (
            <button id='delete-btn' onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
