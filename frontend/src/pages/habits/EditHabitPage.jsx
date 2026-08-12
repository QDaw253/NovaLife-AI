import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getHabit, updateHabit } from '../../api/habits'

function EditHabitPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(null)

  // Load dữ liệu habit hiện tại
  useEffect(() => {
    const fetchHabit = async () => {
      const result = await getHabit(id)

      console.log('Habit edit:', result)

      setFormData({
        title: result.data.title,
        description: result.data.description || '',
        category: result.data.category,
        reminder_time: result.data.reminder_time || '',
        end_date: result.data.end_date || '',
      })
    }

    fetchHabit()
  }, [id])

  // Xử lý khi user thay đổi input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Lưu thay đổi
  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await updateHabit(id, formData)

    console.log('Habit updated:', result)

    // Update thành công -> quay lại trang chi tiết
    navigate(`/habits/${id}`)
  }

  // Trong lúc đang lấy dữ liệu từ backend
  if (!formData) {
    return <p>Đang tải thói quen...</p>
  }

  return (
    <div>
      <h1>Chỉnh sửa thói quen</h1>

      <form onSubmit={handleSubmit}>

        {/* Tên thói quen */}
        <div>
          <label>Tên thói quen</label>
          <br />

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Mô tả */}
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

        {/* Danh mục */}
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

        {/* Giờ nhắc */}
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

        {/* Ngày kết thúc */}
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

        {/* Lưu */}
        <button type="submit">
          Lưu thay đổi
        </button>

      </form>
    </div>
  )
}

export default EditHabitPage