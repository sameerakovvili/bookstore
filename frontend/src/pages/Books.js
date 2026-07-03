import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/books', {
          params: { keyword, page },
        });
        setBooks(data.books);
        setPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [keyword, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setKeyword(searchParams.get('q') || '');
  };

  return (
    <div className="books-page">
      <h1>All Books</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title or author..."
          onChange={(e) => setSearchParams({ q: e.target.value })}
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      <div className="pagination">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i + 1}
            className={page === i + 1 ? 'active' : ''}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
