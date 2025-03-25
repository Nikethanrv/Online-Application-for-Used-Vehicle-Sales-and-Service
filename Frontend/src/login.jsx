import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      })
      const data = await response.json()

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token)
        alert("Successfully logged in!")
        navigate('/')
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("An error occurred during login")
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back to LUCI CARS</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)}/>
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