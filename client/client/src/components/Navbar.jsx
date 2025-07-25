import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <h2>MERN Blog</h2>
      <div>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/create">Create Post</Link>
      </div>
    </nav>
  );
}

export default Navbar;
