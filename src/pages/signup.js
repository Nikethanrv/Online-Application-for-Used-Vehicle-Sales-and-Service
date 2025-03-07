// src/pages/Signup.js
import { Link } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create LUCI CARS Account</h2>
        <form className="signup-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required />
          </div>
          <button type="submit" className="signup-submit">Create Account</button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;