import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();
  const { userInfo } = useAuth();

  const fetchBook = async () => {
    const { data } = await api.get(`/books/${id}`);
    setBook(data);
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setMessage('Added to cart!');
    setTimeout(() => setMessage(''), 2000);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/books/${id}/reviews`, { rating, comment });
      setComment('');
      fetchBook();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="book-detail">
      <div className="book-detail-main">
        <div className="book-cover-large">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} />
          ) : (
            <div className="book-cover-placeholder">{book.title.charAt(0)}</div>
          )}
        </div>
        <div className="book-info">
          <h1>{book.title}</h1>
          <p className="book-author">by {book.author}</p>
          <p className="book-rating">⭐ {book.rating.toFixed(1)} ({book.numReviews} reviews)</p>
          <p className="book-price">${book.price.toFixed(2)}</p>
          <p>{book.description}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Language:</strong> {book.language}</p>
          <p><strong>In stock:</strong> {book.stock}</p>

          <div className="add-to-cart">
            <input
              type="number"
              min="1"
              max={book.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button className="btn-primary" onClick={handleAddToCart} disabled={book.stock === 0}>
              {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
          {message && <p className="message">{message}</p>}
        </div>
      </div>

      <div className="reviews">
        <h2>Reviews</h2>
        {book.reviews.length === 0 && <p>No reviews yet.</p>}
        {book.reviews.map((r) => (
          <div key={r._id} className="review">
            <strong>{r.name}</strong> - ⭐ {r.rating}
            <p>{r.comment}</p>
          </div>
        ))}

        {userInfo ? (
          <form className="review-form" onSubmit={submitReview}>
            <h3>Write a review</h3>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} stars</option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              required
            />
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        ) : (
          <p>Please log in to write a review.</p>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
