import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyBook = {
  title: '', author: '', description: '', genre: '', language: 'English', price: 0, stock: 0, coverImage: '',
};

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchBooks = async () => {
    const { data } = await api.get('/books?limit=100');
    setBooks(data.books);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyBook);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) {
        await api.put(`/books/${editingId}`, payload);
        setMessage('Book updated');
      } else {
        await api.post('/books', payload);
        setMessage('Book created');
      }
      resetForm();
      fetchBooks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error saving book');
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title, author: book.author, description: book.description,
      genre: book.genre, language: book.language, price: book.price,
      stock: book.stock, coverImage: book.coverImage,
    });
    setEditingId(book._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    await api.delete(`/books/${id}`);
    fetchBooks();
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit Book' : 'Add New Book'}</h2>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required />
        <input name="language" placeholder="Language" value={form.language} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input name="coverImage" placeholder="Cover Image URL" value={form.coverImage} onChange={handleChange} />
        <div>
          <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={resetForm} className="btn-link">Cancel</button>}
        </div>
        {message && <p className="message">{message}</p>}
      </form>

      <h2>All Books ({books.length})</h2>
      <table className="admin-table">
        <thead>
          <tr><th>Title</th><th>Author</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>${book.price.toFixed(2)}</td>
              <td>{book.stock}</td>
              <td>
                <button onClick={() => handleEdit(book)} className="btn-link">Edit</button>
                <button onClick={() => handleDelete(book._id)} className="btn-link">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
