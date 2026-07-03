import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await api.get('/books?limit=4');
        setBooks(data.books);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to BookStore</h1>
        <p>Your one-stop destination for all things books!</p>
        <Link to="/books" className="btn-primary">Browse Books</Link>
      </section>

      <section className="featured">
        <h2>Featured Books</h2>
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
