import { useEffect, useState } from 'react'
import { getHabits } from '../../api/habits'
import { Link } from 'react-router-dom'

function HabitsPage() {
  const [habits, setHabits] = useState([])

  useEffect(() => {
    const fetchHabits = async () => {
      const result = await getHabits()

      setHabits(result.data)
    }

    fetchHabits()
  }, [])

  return (
    <div>
      <h1>Thói quen</h1>
      <p>Theo dõi thói quen hằng ngày.</p>

      {habits.map((habit) => (
        <div key={habit.id}>
          <h3>
            <Link to={`/habits/${habit.id}`}>
              {habit.title}
            </Link>
        </h3>
          <p>Danh mục: {habit.category}</p>
          <p>Tần suất: {habit.frequency}</p>
          <p>Mục tiêu: {habit.target_value} {habit.unit}</p>
          <p>Giờ nhắc: {habit.reminder_time || 'Không có'}</p>

          <hr />
        </div>
      ))}
    </div>
  )
}

export default HabitsPage