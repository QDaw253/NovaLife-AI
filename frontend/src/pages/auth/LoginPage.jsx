import { useState } from 'react'
import { login } from '../../api/auth'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const result = await login({
      email: email,
      password: password,
    })

    console.log(result)
  }

  return (
    <div>
      <h1>Đăng nhập NovaLife</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label>Mật khẩu</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit">
          Đăng nhập
        </button>
      </form>
    </div>
  )
}

export default LoginPage