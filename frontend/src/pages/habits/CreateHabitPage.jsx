import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createHabit } from '../../api/habits'

function CreateHabitPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      ...formData,
      end_date: formData.end_date || null,
      reminder_time: formData.reminder_time || null,
    }

    await createHabit(data)

    navigate('/habits')
  }

  return (
    <div>
      <h1>Tạo thói quen mới</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên thói quen</label>
          <br />

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Mô tả</label>
          <br />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Danh mục</label>
          <br />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="health">Sức khỏe</option>
            <option value="fitness">Thể hình</option>
            <option value="study">Học tập</option>
            <option value="personal">Cá nhân</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <br />

        <div>
          <label>Tần suất</label>
          <br />

          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
          >
            <option value="daily">Hằng ngày</option>
            <option value="weekly">Hằng tuần</option>
            <option value="monthly">Hằng tháng</option>
          </select>
        </div>

        <br />

        <div>
          <label>Giá trị mục tiêu</label>
          <br />

          <input
            type="number"
            step="0.01"
            name="target_value"
            value={formData.target_value}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Đơn vị</label>
          <br />

          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Ngày bắt đầu</label>
          <br />

          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Ngày kết thúc</label>
          <br />

          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Giờ nhắc</label>
          <br />

          <input
            type="time"
            name="reminder_time"
            value={formData.reminder_time}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit">
          Tạo thói quen
        </button>
      </form>
    </div>
  )
}

export default CreateHabitPage