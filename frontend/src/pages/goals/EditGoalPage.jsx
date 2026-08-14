import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  getGoal,
  updateGoal,
} from '../../api/goals'


function EditGoalPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'study',
    priority: 'medium',
    deadline: '',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)


  useEffect(() => {
    const fetchGoal = async () => {
      try {
        setLoading(true)
        setError('')

        const result = await getGoal(id)
        const goal = result.data

        setFormData({
          title: goal.title || '',
          description: goal.description || '',
          category: goal.category || 'study',
          priority: goal.priority || 'medium',
          deadline: goal.deadline || '',
        })
      } catch (error) {
        console.error('Load goal error:', error)

        setError('Không thể tải thông tin mục tiêu.')
      } finally {
        setLoading(false)
      }
    }

    fetchGoal()
  }, [id])


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

      await updateGoal(id, formData)

      navigate(`/goals/${id}`)
    } catch (error) {
      console.error('Update goal error:', error)

      const responseData = error.response?.data

      if (responseData?.message) {
        setError(responseData.message)
      } else {
        setError(
          'Không thể cập nhật mục tiêu. Vui lòng kiểm tra lại thông tin.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  if (loading) {
    return (
      <div className="goals-state">
        <div className="goals-state-spinner" />

        <p>Đang tải mục tiêu...</p>
      </div>
    )
  }


  return (
    <div className="goal-form-page">

      <header className="goal-form-header">
        <div>
          <button
            className="goal-form-back"
            type="button"
            onClick={() => navigate(`/goals/${id}`)}
          >
            ← Quay lại chi tiết
          </button>

          <p className="goal-form-eyebrow">
            Chỉnh sửa mục tiêu
          </p>

          <h1>Cập nhật mục tiêu</h1>

          <p className="goal-form-description">
            Điều chỉnh thông tin, mức độ ưu tiên hoặc
            thời hạn để mục tiêu phù hợp hơn với kế hoạch
            hiện tại của bạn.
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
                  Cập nhật tên và mô tả của mục tiêu
                  khi kế hoạch của bạn thay đổi.
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
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả mục tiêu..."
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
                  Điều chỉnh danh mục, mức độ ưu tiên
                  và thời hạn hoàn thành.
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
                  Thay đổi thời hạn nếu kế hoạch của
                  bạn cần được điều chỉnh.
                </small>
              </div>

            </div>
          </section>


          {error && (
            <div className="goal-form-error">
              <strong>
                Không thể cập nhật mục tiêu
              </strong>

              <span>{error}</span>
            </div>
          )}


          <div className="goal-form-actions">
            <button
              className="goal-form-cancel"
              type="button"
              disabled={isSubmitting}
              onClick={() => navigate(`/goals/${id}`)}
            >
              Hủy
            </button>

            <button
              className="goal-form-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Đang lưu...'
                : 'Lưu thay đổi'}
            </button>
          </div>

        </form>


        <aside className="goal-form-side-card">
          <div className="goal-form-side-icon">
            ✎
          </div>

          <h3>Khi nào nên chỉnh sửa?</h3>

          <div className="goal-form-tip">
            <span>01</span>

            <p>
              <strong>Kế hoạch thay đổi</strong>
              Điều chỉnh mục tiêu khi định hướng của
              bạn đã rõ ràng hơn.
            </p>
          </div>

          <div className="goal-form-tip">
            <span>02</span>

            <p>
              <strong>Ưu tiên thay đổi</strong>
              Cập nhật mức độ quan trọng để phản ánh
              kế hoạch hiện tại.
            </p>
          </div>

          <div className="goal-form-tip">
            <span>03</span>

            <p>
              <strong>Thời hạn chưa phù hợp</strong>
              Chọn một deadline thực tế hơn thay vì
              giữ một kế hoạch không còn phù hợp.
            </p>
          </div>
        </aside>

      </div>

    </div>
  )
}


export default EditGoalPage