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
        setError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div>
      <h1>Đăng ký NovaLife</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            Tên đăng nhập
          </label>

          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Mật khẩu
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="confirm_password">
            Xác nhận mật khẩu
          </label>

          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>

      <p>
        Đã có tài khoản?{' '}
        <Link to="/login">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}


export default RegisterPage