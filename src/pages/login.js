// src/pages/Login.js
import { Link } from 'react-router-dom';
import './login.css';

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back to LUCI CARS</h2>
        <form className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required />
          </div>
          <button type="submit" className="login-submit">Sign In</button>
        </form>
        <p className="signup-link">
          New user? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;