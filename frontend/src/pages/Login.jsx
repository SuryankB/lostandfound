import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
        email, password
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userName', res.data.user.name)
      localStorage.setItem('userId', res.data.user.id)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "380px", borderRadius: "12px" }}>
        
        <h3 className="text-center mb-3 fw-bold">Welcome Back </h3>
        <p className="text-center text-muted mb-4">Login to continue</p>

        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100 fw-semibold py-2">
            Login
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don’t have an account?{" "}
          <Link to="/register" className="fw-semibold text-decoration-none">
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login