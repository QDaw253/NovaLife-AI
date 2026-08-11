import { useEffect, useState } from 'react'
import { getGoals } from '../../api/goals'
import { Link } from 'react-router-dom'

function GoalsPage() {
  const [goals, setGoals] = useState([])

  useEffect(() => {
    const fetchGoals = async () => {
      const result = await getGoals()

      setGoals(result.data)
    }

    fetchGoals()
  }, [])

  return (
    <div>
        <h1>Mục tiêu</h1>
        <p>Quản lý mục tiêu cá nhân.</p>

        {goals.map((goal) => (
        <div key={goal.id}>
            <h3>
                <Link to={`/goals/${goal.id}`}>
                    {goal.title}
                </Link>
            </h3>

            <p>Danh mục: {goal.category}</p>
            <p>Ưu tiên: {goal.priority}</p>
            <p>Trạng thái: {goal.status}</p>
            <p>Tiến độ: {goal.progress}%</p>

            <hr />
        </div>
        ))}
    </div>
    )
}

export default GoalsPage