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
    <div className="auth-page">
      <div className="auth-container">

        <section className="auth-brand">
          <h2 className="auth-brand-logo">
            NovaLife
          </h2>

          <div className="auth-brand-content">
            <h2>
              Xây dựng phiên bản tốt hơn của bạn.
            </h2>

            <p>
              Quản lý mục tiêu, xây dựng thói quen,
              tổ chức tủ đồ và tận dụng AI trong
              một không gian duy nhất.
            </p>
          </div>

          <div className="auth-brand-footer">
            Your life. Your progress. Your NovaLife.
          </div>
        </section>


        <section className="auth-panel">
          <div className="auth-form-wrapper">

            <div className="auth-heading">
              <h1>Chào mừng trở lại</h1>

              <p>
                Đăng nhập để tiếp tục hành trình của bạn.
              </p>
            </div>


            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="auth-field">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>


              <div className="auth-field">
                <label htmlFor="password">
                  Mật khẩu
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>


              <button
                className="auth-submit"
                type="submit"
              >
                Đăng nhập
              </button>
            </form>


            <p className="auth-switch">
              Chưa có tài khoản?{' '}

              <Link to="/register">
                Đăng ký
              </Link>
            </p>

          </div>
        </section>

      </div>
    </div>
  )
}


export default LoginPage