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

  const [fieldErrors, setFieldErrors] =
    useState({})

  const [error, setError] =
    useState('')

  const [isSubmitting, setIsSubmitting] =
    useState(false)


  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [name]: undefined,
    }))

    setError('')
  }


  // =====================================================
  // FIELD ERROR
  // =====================================================

  const renderFieldErrors = (fieldName) => {
    const errors =
      fieldErrors[fieldName]

    if (!errors) {
      return null
    }

    const errorList =
      Array.isArray(errors)
        ? errors
        : [errors]

    return (
      <div className="goal-field-errors">
        {errorList.map(
          (message, index) => (
            <p key={index}>
              {message}
            </p>
          ),
        )}
      </div>
    )
  }


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setError('')
      setFieldErrors({})

      const result =
        await createGoal(formData)

      navigate(
        `/goals/${result.data.id}`,
      )
    }
    catch (err) {
      console.error('Create goal error:', err)

      const responseData = err.response?.data

      console.log('STATUS:', err.response?.status)
      console.log('BACKEND RESPONSE:', responseData)

      if (
        responseData?.errors &&
        typeof responseData.errors === 'object'
      ) {
        setFieldErrors(responseData.errors)
        return
      }

      if (responseData?.message) {
        setError(responseData.message)
        return
      }

      setError(
        'Không thể tạo mục tiêu. Vui lòng kiểm tra lại thông tin.',
      )
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
            onClick={() =>
              navigate('/goals')
            }
          >
            ← Quay lại mục tiêu
          </button>

          <p className="goal-form-eyebrow">
            Mục tiêu mới
          </p>

          <h1>
            Tạo mục tiêu
          </h1>

          <p className="goal-form-description">
            Xác định điều bạn muốn đạt được.
            NovaLife sẽ giúp bạn tổ chức hành
            trình thành những bước rõ ràng hơn.
          </p>

        </div>
      </header>


      <div className="goal-form-layout">

        <form
          className="goal-form-card"
          onSubmit={handleSubmit}
        >

          {/* ===================================
              INFORMATION
              =================================== */}

          <section className="goal-form-section">

            <div className="goal-form-section-heading">

              <span className="goal-form-section-number">
                01
              </span>

              <div>
                <h2>
                  Thông tin mục tiêu
                </h2>

                <p>
                  Mô tả rõ điều bạn muốn đạt
                  được để AI có thể xây dựng
                  lộ trình phù hợp.
                </p>
              </div>

            </div>


            <div className="goal-form-fields">

              {/* TITLE */}

              <div
                className={
                  `goal-form-field ${
                    fieldErrors.title
                      ? 'has-error'
                      : ''
                  }`
                }
              >

                <label htmlFor="goal-title">
                  Tên mục tiêu
                  <span>*</span>
                </label>

                <input
                  id="goal-title"
                  name="title"
                  type="text"
                  placeholder="Ví dụ: Giảm 5kg"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <small>
                  Hãy nêu rõ kết quả bạn muốn
                  đạt được.
                </small>

                {renderFieldErrors(
                  'title'
                )}

              </div>


              {/* DESCRIPTION */}

              <div
                className={
                  `goal-form-field ${
                    fieldErrors.description
                      ? 'has-error'
                      : ''
                  }`
                }
              >

                <label htmlFor="goal-description">
                  Mô tả
                  <span>*</span>
                </label>

                <textarea
                  id="goal-description"
                  name="description"
                  rows="5"
                  placeholder={
                    'Ví dụ: Tôi muốn giảm 5kg ' +
                    'để cải thiện thể lực và duy trì ' +
                    'cân nặng ổn định.'
                  }
                  value={formData.description}
                  onChange={handleChange}
                  required
                />

                <small>
                  Cung cấp đủ thông tin để NovaLife
                  hiểu mục tiêu của bạn.
                </small>

                {renderFieldErrors(
                  'description'
                )}

              </div>

            </div>

          </section>


          <div className="goal-form-divider" />


          {/* ===================================
              SETTINGS
              =================================== */}

          <section className="goal-form-section">

            <div className="goal-form-section-heading">

              <span className="goal-form-section-number">
                02
              </span>

              <div>
                <h2>
                  Thiết lập mục tiêu
                </h2>

                <p>
                  Phân loại và xác định mức độ
                  ưu tiên cho mục tiêu của bạn.
                </p>
              </div>

            </div>


            <div className="goal-form-grid">

              {/* CATEGORY */}

              <div
                className={
                  `goal-form-field ${
                    fieldErrors.category
                      ? 'has-error'
                      : ''
                  }`
                }
              >

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

                  <option value="career">Sự nghiệp</option>
                  <option value="finance">Tài chính</option>
                  <option value="relationship">Mối quan hệ</option>
                  <option value="personal_development">Phát triển bản thân</option>
                  <option value="other">Khác</option>

                </select>

                {renderFieldErrors(
                  'category'
                )}

              </div>


              {/* PRIORITY */}

              <div
                className={
                  `goal-form-field ${
                    fieldErrors.priority
                      ? 'has-error'
                      : ''
                  }`
                }
              >

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

                {renderFieldErrors(
                  'priority'
                )}

              </div>


              {/* DEADLINE */}

              <div
                className={
                  `goal-form-field ` +
                  `goal-form-field--full ${
                    fieldErrors.deadline
                      ? 'has-error'
                      : ''
                  }`
                }
              >

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
                  Chọn thời điểm bạn muốn hoàn
                  thành mục tiêu này.
                </small>

                {renderFieldErrors(
                  'deadline'
                )}

              </div>

            </div>

          </section>


          {/* GENERAL ERROR */}

          {error && (
            <div className="goal-form-error">

              <strong>
                Không thể tạo mục tiêu
              </strong>

              <span>
                {error}
              </span>

            </div>
          )}


          {/* ACTIONS */}

          <div className="goal-form-actions">

            <button
              className="goal-form-cancel"
              type="button"
              onClick={() =>
                navigate('/goals')
              }
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
                ? 'AI đang tạo lộ trình...'
                : 'Tạo mục tiêu'}
            </button>

          </div>

        </form>


        {/* ===================================
            SIDE
            =================================== */}

        <aside className="goal-form-side-card">

          <div className="goal-form-side-icon">
            ◎
          </div>

          <h3>
            Một mục tiêu tốt nên...
          </h3>

          <div className="goal-form-tip">
            <span>01</span>

            <p>
              <strong>
                Rõ ràng
              </strong>

              Mô tả chính xác điều bạn muốn
              đạt được.
            </p>
          </div>


          <div className="goal-form-tip">
            <span>02</span>

            <p>
              <strong>
                Có thời hạn
              </strong>

              Đặt một mốc thời gian thực tế
              để theo dõi.
            </p>
          </div>


          <div className="goal-form-tip">
            <span>03</span>

            <p>
              <strong>
                Có thể hành động
              </strong>

              Mục tiêu nên có khả năng chia
              thành những bước nhỏ hơn.
            </p>
          </div>

        </aside>

      </div>

    </div>
  )
}


export default CreateGoalPage