import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [form, setForm] = useState({ title: '', content: '', category: '' });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/posts', form);
      navigate('/');
    } catch (err) {
      console.error('Error creating post', err);
    }
  };

  return (
    <div>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required /><br />
        <textarea name="content" placeholder="Content" onChange={handleChange} required /><br />
        <select name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option value={cat._id} key={cat._id}>{cat.name}</option>
          ))}
        </select><br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreatePost;
