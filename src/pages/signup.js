import { Link } from 'react-router-dom';
import './styles/signup.css';

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create LUCI CARS Account</h2>
        <form className="signup-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="full_name" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group">
            <label>Create Password</label>
            <input type="password" name="password" required />
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
