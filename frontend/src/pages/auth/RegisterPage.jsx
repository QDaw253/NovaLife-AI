import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { register } from '../../api/auth'


function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  })

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()


  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (formData.password !== formData.confirm_password) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    try {
      setIsSubmitting(true)

      await register(formData)

      navigate('/login')
    } catch (err) {
      const responseData = err.response?.data

      if (responseData?.message) {
        setError(responseData.message)
      } else {
        setError(
          'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
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
              Bắt đầu hành trình NovaLife của bạn.
            </h2>

            <p>
              Xây dựng mục tiêu, duy trì thói quen,
              quản lý phong cách và khám phá những
              gợi ý thông minh dành riêng cho bạn.
            </p>
          </div>

          <div className="auth-brand-footer">
            Your life. Your progress. Your NovaLife.
          </div>
        </section>


        <section className="auth-panel">
          <div className="auth-form-wrapper">

            <div className="auth-heading">
              <h1>Tạo tài khoản</h1>

              <p>
                Tạo tài khoản để bắt đầu với NovaLife.
              </p>
            </div>


            <form
              className="auth-form auth-form--register"
              onSubmit={handleSubmit}
            >
              <div className="auth-field">
                <label htmlFor="username">
                  Tên đăng nhập
                </label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="auth-field">
                <label htmlFor="register-email">
                  Email
                </label>

                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="auth-field">
                <label htmlFor="register-password">
                  Mật khẩu
                </label>

                <input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="auth-field">
                <label htmlFor="confirm-password">
                  Xác nhận mật khẩu
                </label>

                <input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>


              {error && (
                <p className="auth-error">
                  {error}
                </p>
              )}


              <button
                className="auth-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Đang đăng ký...'
                  : 'Đăng ký'}
              </button>
            </form>


            <p className="auth-switch">
              Đã có tài khoản?{' '}

              <Link to="/login">
                Đăng nhập
              </Link>
            </p>

          </div>
        </section>

      </div>
    </div>
  )
}


export default RegisterPage