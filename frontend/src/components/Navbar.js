import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">📚 BookStore</Link>
      <div className="navbar-links">
        <Link to="/books">Books</Link>
        <Link to="/cart">Cart ({totalItems})</Link>
        {userInfo ? (
          <>
            {userInfo.role === 'admin' && <Link to="/admin">Admin</Link>}
            <span className="navbar-user">Hi, {userInfo.name}</span>
            <button onClick={handleLogout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
