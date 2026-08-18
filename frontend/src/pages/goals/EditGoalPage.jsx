import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  getGoal,
  updateGoal,
} from '../../api/goals'


function EditGoalPage() {
  const { id } = useParams()

  const navigate = useNavigate()

  const [formData, setFormData] =
    useState({
      title: '',
      description: '',
      category: 'study',
      priority: 'medium',
      deadline: '',
    })

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [fieldErrors, setFieldErrors] =
    useState({})

  const [isSubmitting, setIsSubmitting] =
    useState(false)


  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    const fetchGoal = async () => {

      try {
        setLoading(true)
        setError('')

        const result =
          await getGoal(id)

        const goal =
          result.data

        setFormData({
          title:
            goal.title || '',

          description:
            goal.description || '',

          category:
            goal.category || 'study',

          priority:
            goal.priority || 'medium',

          deadline:
            goal.deadline || '',
        })

      } catch (err) {

        console.error(
          'Load goal error:',
          err,
        )

        setError(
          'Không thể tải thông tin mục tiêu.',
        )

      } finally {
        setLoading(false)
      }
    }

    fetchGoal()

  }, [id])


  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (event) => {

    const { name, value } =
      event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    setFieldErrors(
      (previousErrors) => ({
        ...previousErrors,
        [name]: undefined,
      })
    )

    setError('')
  }


  // =====================================================
  // FIELD ERRORS
  // =====================================================

  const renderFieldErrors = (
    fieldName
  ) => {

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

      await updateGoal(
        id,
        formData,
      )

      navigate(
        `/goals/${id}`
      )

    } catch (err) {

      console.error(
        'Update goal error:',
        err,
      )

      const responseData =
        err.response?.data

      if (
        responseData?.errors &&
        typeof responseData.errors ===
          'object'
      ) {

        setFieldErrors(
          responseData.errors
        )

        return
      }

      if (responseData?.message) {

        setError(
          responseData.message
        )

        return
      }

      setError(
        'Không thể cập nhật mục tiêu. Vui lòng kiểm tra lại thông tin.',
      )

    } finally {

      setIsSubmitting(false)
    }
  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="goals-state">

        <div className="goals-state-spinner" />

        <p>
          Đang tải mục tiêu...
        </p>

      </div>
    )
  }


  return (
    <div className="goal-form-page">

      {/* ===================================
          HEADER
          =================================== */}

      <header className="goal-form-header">

        <div>

          <button
            className="goal-form-back"
            type="button"
            onClick={() =>
              navigate(
                `/goals/${id}`
              )
            }
          >
            ← Quay lại chi tiết
          </button>

          <p className="goal-form-eyebrow">
            Chỉnh sửa mục tiêu
          </p>

          <h1>
            Cập nhật mục tiêu
          </h1>

          <p className="goal-form-description">
            Điều chỉnh mục tiêu khi kế hoạch
            của bạn thay đổi. Nếu thông tin
            ảnh hưởng đến lộ trình, NovaLife
            sẽ tạo lại kế hoạch AI.
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
                  Thay đổi tên hoặc mô tả sẽ
                  tạo lại lộ trình AI nếu mục
                  tiêu chưa có tiến độ.
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
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

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
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Mô tả mục tiêu..."
                  required
                />

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
                  Điều chỉnh danh mục, mức độ
                  ưu tiên và thời hạn hoàn thành.
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
                  Thay đổi deadline sẽ khiến AI
                  xây dựng lại lộ trình nếu mục
                  tiêu chưa có tiến độ.
                </small>

                {renderFieldErrors(
                  'deadline'
                )}

              </div>

            </div>

          </section>


          {/* ===================================
              ROADMAP ERROR
              =================================== */}

          {fieldErrors.roadmap && (

            <div className="goal-roadmap-warning">

              <strong>
                Không thể tạo lại lộ trình
              </strong>

              {(
                Array.isArray(
                  fieldErrors.roadmap
                )
                  ? fieldErrors.roadmap
                  : [
                      fieldErrors.roadmap
                    ]
              ).map(
                (message, index) => (
                  <p key={index}>
                    {message}
                  </p>
                )
              )}

            </div>
          )}


          {/* GENERAL ERROR */}

          {error && (

            <div className="goal-form-error">

              <strong>
                Không thể cập nhật mục tiêu
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
              disabled={isSubmitting}
              onClick={() =>
                navigate(
                  `/goals/${id}`
                )
              }
            >
              Hủy
            </button>

            <button
              className="goal-form-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Đang cập nhật...'
                : 'Lưu thay đổi'}
            </button>

          </div>

        </form>


        {/* ===================================
            SIDE CARD
            =================================== */}

        <aside className="goal-form-side-card">

          <div className="goal-form-side-icon">
            ✎
          </div>

          <h3>
            Khi nào nên chỉnh sửa?
          </h3>


          <div className="goal-form-tip">

            <span>01</span>

            <p>
              <strong>
                Kế hoạch thay đổi
              </strong>

              Điều chỉnh mục tiêu khi định
              hướng của bạn đã rõ ràng hơn.
            </p>

          </div>


          <div className="goal-form-tip">

            <span>02</span>

            <p>
              <strong>
                Ưu tiên thay đổi
              </strong>

              Thay đổi ưu tiên không làm
              thay đổi roadmap AI.
            </p>

          </div>


          <div className="goal-form-tip">

            <span>03</span>

            <p>
              <strong>
                Thời hạn chưa phù hợp
              </strong>

              Nếu chưa có tiến độ, NovaLife
              sẽ xây dựng lại roadmap theo
              deadline mới.
            </p>

          </div>

        </aside>

      </div>

    </div>
  )
}


export default EditGoalPage