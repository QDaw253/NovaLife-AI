import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getHabit, updateHabit } from '../../api/habits'

function EditHabitPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    const fetchHabit = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await getHabit(id)
        const habit = result.data
        setFormData({
          title: habit.title || '',
          description: habit.description || '',
          category: habit.category || 'other',
          frequency: habit.frequency || 'daily',
          target_value: habit.target_value || '1',
          unit: habit.unit || 'lần',
          reminder_time: habit.reminder_time || '',
          end_date: habit.end_date || '',
        })
      } catch (err) {
        console.error('Load habit error:', err)
        setError('Không thể tải thông tin thói quen.')
      } finally {
        setLoading(false)
      }
    }
    fetchHabit()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((previousData) => ({ ...previousData, [name]: value }))
    setFieldErrors((previousErrors) => ({ ...previousErrors, [name]: undefined }))
    setError('')
  }

  const renderFieldErrors = (fieldName) => {
    const errors = fieldErrors[fieldName]
    if (!errors) return null
    const errorList = Array.isArray(errors) ? errors : [errors]

    return (
      <div className="habit-field-errors">
        {errorList.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      setError('')
      setFieldErrors({})

      const data = {
        ...formData,
        reminder_time: formData.reminder_time || null,
        end_date: formData.end_date || null,
      }

      await updateHabit(id, data)
      navigate(`/habits/${id}`)
    } catch (err) {
      console.error('Update habit error:', err)
      const responseData = err.response?.data

      if (responseData?.errors && typeof responseData.errors === 'object') {
        setFieldErrors(responseData.errors)
        return
      }

      if (responseData?.message) {
        setError(responseData.message)
        return
      }

      setError('Không thể cập nhật thói quen. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="habit-edit-state">
        <div className="habit-edit-loader" />
        <h2>Đang tải thói quen...</h2>
        <p>NovaLife đang chuẩn bị thông tin của bạn.</p>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="habit-edit-state">
        <h2>Không thể tải thói quen</h2>
        <p>Vui lòng quay lại và thử lại.</p>
        <button type="button" onClick={() => navigate('/habits')}>
          ← Quay lại
        </button>
      </div>
    )
  }

  return (
    <div className="habit-edit-page">
      <div className="habit-edit-header">
        <button type="button" className="habit-edit-back" onClick={() => navigate(`/habits/${id}`)}>
          ← Quay lại chi tiết thói quen
        </button>
        <div className="habit-edit-eyebrow">CHỈNH SỬA</div>
        <h1>Chỉnh sửa thói quen</h1>
        <p>Điều chỉnh thói quen để phù hợp hơn với mục tiêu và nhịp sống hiện tại của bạn.</p>
      </div>

      <div className="habit-edit-layout">
        <form className="habit-edit-form" onSubmit={handleSubmit}>
          <section className="habit-edit-section">
            <div className="habit-edit-section-info">
              <div className="habit-edit-section-number">01</div>
              <div>
                <h2>Thông tin thói quen</h2>
                <p>Cập nhật tên, mô tả và danh mục của thói quen.</p>
              </div>
            </div>

            <div className="habit-edit-fields">
              <div className={`habit-edit-field ${fieldErrors.title ? 'has-error' : ''}`}>
                <label htmlFor="title">Tên thói quen<span>*</span></label>
                <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Tên thói quen" required />
                <small>Hãy nhập một hành động cụ thể.</small>
                {renderFieldErrors('title')}
              </div>

              <div className={`habit-edit-field ${fieldErrors.description ? 'has-error' : ''}`}>
                <label htmlFor="description">Mô tả</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả thói quen..."
                  rows="5"
                />
                {renderFieldErrors('description')}
              </div>

              <div className={`habit-edit-field ${fieldErrors.category ? 'has-error' : ''}`}>
                <label htmlFor="category">Danh mục<span>*</span></label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                  <option value="health">Sức khỏe</option>
                  <option value="fitness">Thể hình</option>
                  <option value="study">Học tập</option>
                  <option value="personal">Cá nhân</option>
                  <option value="other">Khác</option>
                </select>
                {renderFieldErrors('category')}
              </div>
            </div>
          </section>

          <section className="habit-edit-section">
            <div className="habit-edit-section-info">
              <div className="habit-edit-section-number">02</div>
              <div>
                <h2>Mục tiêu hiện tại</h2>
                <p>Điều chỉnh tần suất và mức độ để phù hợp với khả năng hiện tại.</p>
              </div>
            </div>

            <div className="habit-edit-fields">
              <div className={`habit-edit-field ${fieldErrors.frequency ? 'has-error' : ''}`}>
                <label htmlFor="frequency">Tần suất<span>*</span></label>
                <select id="frequency" name="frequency" value={formData.frequency} onChange={handleChange} required>
                  <option value="daily">Hằng ngày</option>
                  <option value="weekly">Hằng tuần</option>
                  <option value="monthly">Hằng tháng</option>
                </select>
                <small>Ví dụ: từ hằng ngày chuyển sang hằng tuần nếu lịch trình thay đổi.</small>
                {renderFieldErrors('frequency')}
              </div>

              <div className="habit-edit-field-row">
                <div className={`habit-edit-field ${fieldErrors.target_value ? 'has-error' : ''}`}>
                  <label htmlFor="target_value">Giá trị mục tiêu<span>*</span></label>
                  <input
                    id="target_value"
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="target_value"
                    value={formData.target_value}
                    onChange={handleChange}
                    required
                  />
                  {renderFieldErrors('target_value')}
                </div>

                <div className={`habit-edit-field ${fieldErrors.unit ? 'has-error' : ''}`}>
                  <label htmlFor="unit">Đơn vị<span>*</span></label>
                  <input
                    id="unit"
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="lần, trang, lít, phút..."
                    required
                  />
                  {renderFieldErrors('unit')}
                </div>
              </div>

              <div className="habit-edit-target-note">
                <span>↗</span>
                <p>
                  Bạn có thể tăng hoặc giảm mục tiêu khi khả năng và lịch trình thay đổi. Các bản ghi tiến độ đã có vẫn được giữ nguyên.
                </p>
              </div>
            </div>
          </section>

          <section className="habit-edit-section">
            <div className="habit-edit-section-info">
              <div className="habit-edit-section-number">03</div>
              <div>
                <h2>Lịch trình</h2>
                <p>Điều chỉnh thời gian kết thúc và lời nhắc của bạn.</p>
              </div>
            </div>

            <div className="habit-edit-fields">
              <div className="habit-edit-field-row">
                <div className={`habit-edit-field ${fieldErrors.reminder_time ? 'has-error' : ''}`}>
                  <label htmlFor="reminder_time">Giờ nhắc</label>
                  <input id="reminder_time" type="time" name="reminder_time" value={formData.reminder_time} onChange={handleChange} />
                  <small>Để trống nếu bạn không muốn đặt lời nhắc.</small>
                  {renderFieldErrors('reminder_time')}
                </div>

                <div className={`habit-edit-field ${fieldErrors.end_date ? 'has-error' : ''}`}>
                  <label htmlFor="end_date">Ngày kết thúc</label>
                  <input id="end_date" type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
                  <small>Có thể để trống nếu muốn duy trì lâu dài.</small>
                  {renderFieldErrors('end_date')}
                </div>
              </div>
            </div>
          </section>

          {error && <div className="habit-edit-error">{error}</div>}

          <div className="habit-edit-actions">
            <button type="button" className="habit-edit-cancel" onClick={() => navigate(`/habits/${id}`)} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="habit-edit-submit" disabled={submitting}>
              {submitting ? 'Đang lưu...' : '✓ Lưu thay đổi'}
            </button>
          </div>
        </form>

        <aside className="habit-edit-guide">
          <div className="habit-edit-guide-icon">✓</div>
          <p className="habit-edit-guide-label">NOVALIFE HABITS</p>
          <h2>Thói quen có thể thay đổi cùng bạn.</h2>
          <p className="habit-edit-guide-description">
            Khi khả năng hoặc lịch trình thay đổi, hãy điều chỉnh mục tiêu để thói quen vẫn thực tế và có thể duy trì.
          </p>
          <div className="habit-edit-guide-divider" />

          <div className="habit-edit-tip">
            <span>01</span>
            <div>
              <strong>Tăng dần thử thách</strong>
              <p>Khi đã quen với thói quen hiện tại, bạn có thể nâng mục tiêu lên.</p>
            </div>
          </div>

          <div className="habit-edit-tip">
            <span>02</span>
            <div>
              <strong>Giảm khi cần thiết</strong>
              <p>Một mục tiêu nhỏ nhưng duy trì được vẫn tốt hơn việc bỏ cuộc hoàn toàn.</p>
            </div>
          </div>

          <div className="habit-edit-tip">
            <span>03</span>
            <div>
              <strong>Điều chỉnh tần suất</strong>
              <p>Daily, weekly hoặc monthly có thể thay đổi theo lịch trình của bạn.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default EditHabitPage