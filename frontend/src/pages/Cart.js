import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useState } from 'react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const placeOrder = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      await api.post('/orders', {
        items: cartItems.map((item) => ({ book: item.book, quantity: item.quantity })),
        shippingAddress: {},
      });
      clearCart();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <p>Your cart is empty. <Link to="/books">Browse books</Link></p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.map((item) => (
        <div key={item.book} className="cart-item">
          <span>{item.title}</span>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.book, Number(e.target.value))}
          />
          <span>${(item.price * item.quantity).toFixed(2)}</span>
          <button onClick={() => removeFromCart(item.book)} className="btn-link">Remove</button>
        </div>
      ))}
      <h2>Total: ${totalPrice.toFixed(2)}</h2>
      {error && <p className="message error">{error}</p>}
      <button className="btn-primary" onClick={placeOrder} disabled={placing}>
        {placing ? 'Placing order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Cart;
