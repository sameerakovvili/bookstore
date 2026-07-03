import { Link } from 'react-router-dom';

const BookCard = ({ book }) => (
  <div className="book-card">
    <Link to={`/books/${book._id}`}>
      <div className="book-cover">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} />
        ) : (
          <div className="book-cover-placeholder">{book.title.charAt(0)}</div>
        )}
      </div>
      <h3>{book.title}</h3>
      <p className="book-author">{book.author}</p>
      <p className="book-price">${book.price.toFixed(2)}</p>
    </Link>
  </div>
);

export default BookCard;
