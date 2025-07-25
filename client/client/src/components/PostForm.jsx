import React, { useEffect, useState } from 'react';

function PostForm({ initialData = {}, onSubmit, submitLabel = 'Submit' }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    category: initialData.category || '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories once
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      /><br />

      <textarea
        name="content"
        placeholder="Content"
        value={form.content}
        onChange={handleChange}
        required
      /><br />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option value={cat._id} key={cat._id}>{cat.name}</option>
        ))}
      </select><br />

      <button type="submit">{submitLabel}</button>
    </form>
  );
}

export default PostForm;
