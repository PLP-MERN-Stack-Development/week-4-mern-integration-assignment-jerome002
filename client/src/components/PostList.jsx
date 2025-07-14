import React from 'react';
import { Link } from 'react-router-dom';

function PostList({ posts = [] }) {
  if (!posts.length) return <p>No posts available.</p>;

  return (
    <div>
      {posts.map(post => (
        <div key={post._id} style={{ border: '1px solid #ddd', marginBottom: '1rem', padding: '1rem' }}>
          <h3>{post.title}</h3>
          <p>{post.excerpt || post.content.slice(0, 100)}...</p>
          <Link to={`/posts/${post._id}`}>Read more</Link>
        </div>
      ))}
    </div>
  );
}

export default PostList;
