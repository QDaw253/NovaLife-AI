import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  createHabit,
} from '../../api/habits'


function CreateHabitPage() {
  const navigate = useNavigate()

  const [formData, setFormData] =
    useState({
      title: '',
      description: '',
      category: 'other',
      frequency: 'daily',
      target_value: '1',
      unit: 'lần',
      start_date: '',
      end_date: '',
      reminder_time: '',
    })

  const [submitting, setSubmitting] =
    useState(false)

  const [error, setError] =
    useState('')

  const [fieldErrors, setFieldErrors] =
    useState({})


  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    )

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
      <div className="habit-field-errors">

        {errorList.map(
          (message, index) => (
            <p key={index}>
              {message}
            </p>
          )
        )}

      </div>
    )
  }


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setFieldErrors({})
    setSubmitting(true)

    const data = {
      ...formData,

      end_date:
        formData.end_date || null,

      reminder_time:
        formData.reminder_time || null,
    }

    try {
      await createHabit(data)

      navigate('/habits')

    } catch (err) {
      console.error(
        'Create habit error:',
        err
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
        (
          "Không thể tạo thói quen. "
          + "Vui lòng kiểm tra lại thông tin."
        )
      )

    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="habit-create-page">

      {/* HEADER */}

      <div className="habit-create-header">

        <button
          type="button"
          className="habit-back-button"
          onClick={() =>
            navigate('/habits')
          }
        >
          ← Quay lại thói quen
        </button>


        <div className="habit-create-eyebrow">
          THÓI QUEN MỚI
        </div>


        <h1>
          Tạo thói quen
        </h1>


        <p>
          Xây dựng những thay đổi nhỏ
          và duy trì chúng mỗi ngày.
          NovaLife sẽ giúp bạn theo dõi
          hành trình của mình.
        </p>

      </div>


      <div className="habit-create-layout">

        {/* FORM */}

        <form
          className="habit-create-form"
          onSubmit={handleSubmit}
        >

          {/* ===================================
              SECTION 01
              =================================== */}

          <section className="habit-form-section">

            <div className="habit-section-info">

              <div className="habit-section-number">
                01
              </div>

              <div>
                <h2>
                  Thông tin thói quen
                </h2>

                <p>
                  Mô tả điều bạn muốn
                  duy trì thường xuyên.
                </p>
              </div>

            </div>


            <div className="habit-section-fields">

              {/* TITLE */}

              <div
                className={
                  `habit-field ${
                    fieldErrors.title
                      ? 'has-error'
                      : ''
                  }`
                }
              >
                <label htmlFor="title">
                  Tên thói quen
                  <span>*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={
                    'Ví dụ: Uống đủ nước mỗi ngày'
                  }
                  required
                />

                <small>
                  Hãy nhập một hành động
                  cụ thể mà bạn muốn duy trì.
                </small>

                {renderFieldErrors(
                  'title'
                )}
              </div>


              {/* DESCRIPTION */}

              <div
                className={
                  `habit-field ${
                    fieldErrors.description
                      ? 'has-error'
                      : ''
                  }`
                }
              >
                <label htmlFor="description">
                  Mô tả
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder={
                    'Mô tả ngắn về thói quen bạn muốn xây dựng...'
                  }
                  rows="5"
                />

                {renderFieldErrors(
                  'description'
                )}
              </div>

            </div>

          </section>


          {/* ===================================
              SECTION 02
              =================================== */}

          <section className="habit-form-section">

            <div className="habit-section-info">

              <div className="habit-section-number">
                02
              </div>

              <div>
                <h2>
                  Thiết lập thói quen
                </h2>

                <p>
                  Chọn danh mục, tần suất
                  và mục tiêu phù hợp.
                </p>
              </div>

            </div>


            <div className="habit-section-fields">

              <div className="habit-field-row">

                {/* CATEGORY */}

                <div
                  className={
                    `habit-field ${
                      fieldErrors.category
                        ? 'has-error'
                        : ''
                    }`
                  }
                >
                  <label htmlFor="category">
                    Danh mục
                    <span>*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={handleChange}
                  >
                    <option value="health">
                      Sức khỏe
                    </option>

                    <option value="fitness">
                      Thể hình
                    </option>

                    <option value="study">
                      Học tập
                    </option>

                    <option value="personal">
                      Cá nhân
                    </option>

                    <option value="other">
                      Khác
                    </option>
                  </select>

                  {renderFieldErrors(
                    'category'
                  )}
                </div>


                {/* FREQUENCY */}

                <div
                  className={
                    `habit-field ${
                      fieldErrors.frequency
                        ? 'has-error'
                        : ''
                    }`
                  }
                >
                  <label htmlFor="frequency">
                    Tần suất
                    <span>*</span>
                  </label>

                  <select
                    id="frequency"
                    name="frequency"
                    value={
                      formData.frequency
                    }
                    onChange={handleChange}
                  >
                    <option value="daily">
                      Hằng ngày
                    </option>

                    <option value="weekly">
                      Hằng tuần
                    </option>

                    <option value="monthly">
                      Hằng tháng
                    </option>
                  </select>

                  {renderFieldErrors(
                    'frequency'
                  )}
                </div>

              </div>


              <div className="habit-field-row">

                {/* TARGET */}

                <div
                  className={
                    `habit-field ${
                      fieldErrors.target_value
                        ? 'has-error'
                        : ''
                    }`
                  }
                >
                  <label htmlFor="target_value">
                    Giá trị mục tiêu
                    <span>*</span>
                  </label>

                  <input
                    id="target_value"
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="target_value"
                    value={
                      formData.target_value
                    }
                    onChange={handleChange}
                    placeholder="Ví dụ: 2"
                    required
                  />

                  {renderFieldErrors(
                    'target_value'
                  )}
                </div>


                {/* UNIT */}

                <div
                  className={
                    `habit-field ${
                      fieldErrors.unit
                        ? 'has-error'
                        : ''
                    }`
                  }
                >
                  <label htmlFor="unit">
                    Đơn vị
                    <span>*</span>
                  </label>

                  <input
                    id="unit"
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder={
                      'lần, lít, phút...'
                    }
                    required
                  />

                  {renderFieldErrors(
                    'unit'
                  )}
                </div>

              </div>

            </div>

          </section>


          {/* ===================================
              SECTION 03
              =================================== */}

          <section className="habit-form-section">

            <div className="habit-section-info">

              <div className="habit-section-number">
                03
              </div>

              <div>
                <h2>
                  Thời gian
                </h2>

                <p>
                  Xác định thời gian thực hiện
                  và lời nhắc.
                </p>
              </div>

            </div>


            <div className="habit-section-fields">

              <div className="habit-field-row">

                {/* START DATE */}

                <div
                  className={
                    `habit-field ${
                      fieldErrors.start_date
                        ? 'has-error'
                        : ''
                    }`
                  }
                >
                  <label htmlFor="start_date">
                    Ngày bắt đầu
                    <span>*</span>
                  </label>

                  <input
                    id="start_date"
                    type="date"
                    name="start_date"
                    value={
                      formData.start_date
                    }
                    onChange={handleChange}
                    required
                  />

                  {renderFieldErrors(
                    'start_date'
                  )}
                </div>


                {/* END DATE */}

                <div
                  className={
                    `habit-field ${
                      fieldErrors.end_date
                        ? 'has-error'
                        : ''
                    }`
                  }
                >
                  <label htmlFor="end_date">
                    Ngày kết thúc
                  </label>

                  <input
                    id="end_date"
                    type="date"
                    name="end_date"
                    value={
                      formData.end_date
                    }
                    onChange={handleChange}
                    min={
                      formData.start_date ||
                      undefined
                    }
                  />

                  <small>
                    Có thể để trống nếu bạn
                    muốn duy trì lâu dài.
                  </small>

                  {renderFieldErrors(
                    'end_date'
                  )}
                </div>

              </div>


              {/* REMINDER */}

              <div
                className={
                  `habit-field ${
                    fieldErrors.reminder_time
                      ? 'has-error'
                      : ''
                  }`
                }
              >
                <label htmlFor="reminder_time">
                  Giờ nhắc
                </label>

                <input
                  id="reminder_time"
                  type="time"
                  name="reminder_time"
                  value={
                    formData.reminder_time
                  }
                  onChange={handleChange}
                />

                <small>
                  NovaLife sẽ sử dụng thời gian
                  này để nhắc bạn duy trì
                  thói quen.
                </small>

                {renderFieldErrors(
                  'reminder_time'
                )}
              </div>

            </div>

          </section>


          {/* GENERAL ERROR */}

          {error && (
            <div className="habit-form-error">
              {error}
            </div>
          )}


          {/* ACTIONS */}

          <div className="habit-form-actions">

            <button
              type="button"
              className="habit-cancel-button"
              onClick={() =>
                navigate('/habits')
              }
              disabled={submitting}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="habit-submit-button"
              disabled={submitting}
            >
              {submitting
                ? 'Đang tạo...'
                : '+ Tạo thói quen'}
            </button>

          </div>

        </form>


        {/* RIGHT SIDEBAR */}

        <aside className="habit-create-guide">

          <div className="habit-guide-icon">
            ✓
          </div>

          <h2>
            Một thói quen tốt nên...
          </h2>


          <div className="habit-guide-item">
            <span>01</span>

            <div>
              <strong>
                Dễ bắt đầu
              </strong>

              <p>
                Bắt đầu từ một hành động
                nhỏ mà bạn có thể duy trì.
              </p>
            </div>
          </div>


          <div className="habit-guide-item">
            <span>02</span>

            <div>
              <strong>
                Đo lường được
              </strong>

              <p>
                Sử dụng số lần, phút, lít
                hoặc một đơn vị cụ thể.
              </p>
            </div>
          </div>


          <div className="habit-guide-item">
            <span>03</span>

            <div>
              <strong>
                Duy trì đều đặn
              </strong>

              <p>
                Chọn tần suất phù hợp với
                lịch sinh hoạt của bạn.
              </p>
            </div>
          </div>


          <div className="habit-guide-item">
            <span>04</span>

            <div>
              <strong>
                Có lời nhắc
              </strong>

              <p>
                Một thời điểm cố định giúp
                bạn dễ hình thành thói quen hơn.
              </p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  )
}


export default CreateHabitPage