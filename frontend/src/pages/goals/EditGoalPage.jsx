import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getGoal, updateGoal } from '../../api/goals'

function EditGoalPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    deadline: '',
    })

    const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    })
    }
    const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await updateGoal(id, formData)

    console.log('Updated goal:', result)

    navigate(`/goals/${id}`)
    }

    useEffect(() => {
    const fetchGoal = async () => {
        const result = await getGoal(id)

        setFormData({
        title: result.data.title,
        description: result.data.description,
        category: result.data.category,
        priority: result.data.priority,
        deadline: result.data.deadline || '',
        })
    }

    fetchGoal()
    }, [id])

  return (
    <div>
        <h1>Chỉnh sửa mục tiêu</h1>

        <form onSubmit={handleSubmit}>
        <div>
            <label>Tên mục tiêu</label>
            <br />

            <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
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
            <option value="study">Học tập</option>
            <option value="career">Sự nghiệp</option>
            <option value="health">Sức khỏe</option>
            <option value="personal">Cá nhân</option>
            </select>
        </div>

        <br />

        <div>
            <label>Ưu tiên</label>
            <br />

            <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
            </select>
        </div>

        <br />

        <div>
            <label>Deadline</label>
            <br />

            <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            />
        </div>

        <br />

        <button type="submit">
            Lưu thay đổi
        </button>
        </form>
    </div>
    )
}

export default EditGoalPage