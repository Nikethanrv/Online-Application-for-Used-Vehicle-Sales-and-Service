import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        toast.success("Successfully logged in!", {
          position: "top-right",
          autoClose: 2000
        })
        setTimeout(() => {
          navigate('/')
        }, 3000) // Navigate after toast shows
      } else {
        toast.error(data.message || "Login failed", {
          position: "top-right",
          autoClose: 3000
        })
      }
    } catch (error) {
      toast.error("An error occurred during login", {
        position: "top-right",
        autoClose: 3000
      })
    }
  }

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-container">
        <h2>Welcome Back to S3H CARS</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
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
