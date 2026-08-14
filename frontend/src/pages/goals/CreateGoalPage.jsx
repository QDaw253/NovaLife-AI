import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createGoal } from '../../api/goals'


function CreateGoalPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'study',
    priority: 'medium',
    deadline: '',
  })

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)


  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setError('')

      const result = await createGoal(formData)

      navigate(`/goals/${result.data.id}`)
    } catch (error) {
      console.error('Create goal error:', error)

      const responseData = error.response?.data

      if (responseData?.message) {
        setError(responseData.message)
      } else {
        setError(
          'Không thể tạo mục tiêu. Vui lòng kiểm tra lại thông tin.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="goal-form-page">

      <header className="goal-form-header">
        <div>
          <button
            className="goal-form-back"
            type="button"
            onClick={() => navigate('/goals')}
          >
            ← Quay lại mục tiêu
          </button>

          <p className="goal-form-eyebrow">
            Mục tiêu mới
          </p>

          <h1>Tạo mục tiêu</h1>

          <p className="goal-form-description">
            Xác định điều bạn muốn đạt được.
            NovaLife sẽ giúp bạn tổ chức hành trình
            thành những bước rõ ràng hơn.
          </p>
        </div>
      </header>


      <div className="goal-form-layout">

        <form
          className="goal-form-card"
          onSubmit={handleSubmit}
        >

          <section className="goal-form-section">
            <div className="goal-form-section-heading">
              <span className="goal-form-section-number">
                01
              </span>

              <div>
                <h2>Thông tin mục tiêu</h2>

                <p>
                  Mô tả ngắn gọn và rõ ràng điều
                  bạn muốn hoàn thành.
                </p>
              </div>
            </div>


            <div className="goal-form-fields">

              <div className="goal-form-field">
                <label htmlFor="goal-title">
                  Tên mục tiêu
                  <span>*</span>
                </label>

                <input
                  id="goal-title"
                  name="title"
                  type="text"
                  placeholder="Ví dụ: Cải thiện tiếng Anh giao tiếp"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="goal-form-field">
                <label htmlFor="goal-description">
                  Mô tả
                </label>

                <textarea
                  id="goal-description"
                  name="description"
                  rows="5"
                  placeholder="Mô tả mục tiêu và kết quả bạn muốn đạt được..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

            </div>
          </section>


          <div className="goal-form-divider" />


          <section className="goal-form-section">
            <div className="goal-form-section-heading">
              <span className="goal-form-section-number">
                02
              </span>

              <div>
                <h2>Thiết lập mục tiêu</h2>

                <p>
                  Phân loại và xác định mức độ ưu tiên
                  cho mục tiêu của bạn.
                </p>
              </div>
            </div>


            <div className="goal-form-grid">

              <div className="goal-form-field">
                <label htmlFor="goal-category">
                  Danh mục
                  <span>*</span>
                </label>

                <select
                  id="goal-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="study">
                    Học tập
                  </option>

                  <option value="career">
                    Sự nghiệp
                  </option>

                  <option value="health">
                    Sức khỏe
                  </option>

                  <option value="personal">
                    Cá nhân
                  </option>
                </select>
              </div>


              <div className="goal-form-field">
                <label htmlFor="goal-priority">
                  Mức độ ưu tiên
                  <span>*</span>
                </label>

                <select
                  id="goal-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="low">
                    Thấp
                  </option>

                  <option value="medium">
                    Trung bình
                  </option>

                  <option value="high">
                    Cao
                  </option>
                </select>
              </div>


              <div className="goal-form-field goal-form-field--full">
                <label htmlFor="goal-deadline">
                  Thời hạn
                  <span>*</span>
                </label>

                <input
                  id="goal-deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />

                <small>
                  Chọn thời điểm bạn muốn hoàn thành
                  mục tiêu này.
                </small>
              </div>

            </div>
          </section>


          {error && (
            <div className="goal-form-error">
              <strong>Không thể tạo mục tiêu</strong>

              <span>{error}</span>
            </div>
          )}


          <div className="goal-form-actions">
            <button
              className="goal-form-cancel"
              type="button"
              onClick={() => navigate('/goals')}
              disabled={isSubmitting}
            >
              Hủy
            </button>

            <button
              className="goal-form-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Đang tạo...'
                : 'Tạo mục tiêu'}
            </button>
          </div>

        </form>


        <aside className="goal-form-side-card">
          <div className="goal-form-side-icon">
            ◎
          </div>

          <h3>Một mục tiêu tốt nên...</h3>

          <div className="goal-form-tip">
            <span>01</span>

            <p>
              <strong>Rõ ràng</strong>
              Mô tả chính xác điều bạn muốn đạt được.
            </p>
          </div>

          <div className="goal-form-tip">
            <span>02</span>

            <p>
              <strong>Có thời hạn</strong>
              Đặt một mốc thời gian thực tế để theo dõi.
            </p>
          </div>

          <div className="goal-form-tip">
            <span>03</span>

            <p>
              <strong>Có thể hành động</strong>
              Mục tiêu nên có khả năng chia thành
              những bước nhỏ hơn.
            </p>
          </div>
        </aside>

      </div>

    </div>
  )
}


export default CreateGoalPage