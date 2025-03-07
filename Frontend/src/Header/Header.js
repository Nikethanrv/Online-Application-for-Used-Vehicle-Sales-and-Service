// src/components/Header/Header.js
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand">
          <span className="luci">LUCI</span>
          <span className="cars">CARS</span>
        </Link>

        {/* Search Bar */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search by make, model, or keyword..."
            className="search-input"
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/used-cars">Used Cars</Link>
          <Link to="/sellcars">Sell Cars</Link>
          <Link to="/services">Services</Link>
        </nav>

        {/* Login Button */}
        <Link to="/login" className="login-button">
          <i className="fas fa-user"></i>
          <span>Login</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;