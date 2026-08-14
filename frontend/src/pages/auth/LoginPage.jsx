import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { login } from '../../api/auth'
import { useAuth } from '../../contexts/AuthContext'


function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setUser } = useAuth()
  const navigate = useNavigate()


  const handleSubmit = async (event) => {
    event.preventDefault()

    const result = await login({
      email: email,
      password: password,
    })

    localStorage.setItem(
      'access_token',
      result.data.access,
    )

    localStorage.setItem(
      'refresh_token',
      result.data.refresh,
    )

    localStorage.setItem(
      'user',
      JSON.stringify(result.data.user),
    )

    setUser(result.data.user)

    navigate('/dashboard')
  }


  return (
    <div>
      <h1>Đăng nhập NovaLife</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Mật khẩu
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit">
          Đăng nhập
        </button>
      </form>

      <p>
        Chưa có tài khoản?{' '}
        <Link to="/register">
          Đăng ký
        </Link>
      </p>
    </div>
  )
}


export default LoginPage