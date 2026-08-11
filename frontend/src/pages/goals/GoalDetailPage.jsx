import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getGoal } from '../../api/goals'

function GoalDetailPage() {
  const { id } = useParams()
  const [goal, setGoal] = useState(null)

  useEffect(() => {
    const fetchGoal = async () => {
        const result = await getGoal(id)

        setGoal(result.data)
    }

    fetchGoal()
    }, [id])

    if (!goal) {
        return <p>Đang tải mục tiêu...</p>
    }

  return (
    <div>
        <h1>{goal.title}</h1>

        <p>{goal.description}</p>

        <p>Danh mục: {goal.category}</p>
        <p>Ưu tiên: {goal.priority}</p>
        <p>Trạng thái: {goal.status}</p>
        <p>Tiến độ: {goal.progress}%</p>
        <p>Deadline: {goal.deadline || 'Không có'}</p>

        <hr />

        <h2>Kế hoạch AI</h2>

        <p>
        Độ khó: {goal.ai_plan?.difficulty}
        </p>

        <p>
        Thời lượng dự kiến: {goal.ai_plan?.estimated_duration}
        </p>

        <p>
        Số giờ / tuần: {goal.ai_plan?.recommended_hours_per_week}
        </p>

        <hr />

        <h2>Milestones</h2>

        {goal.milestones?.map((milestone) => (
            <div key={milestone.id}>
                <h3>{milestone.title}</h3>

                <p>{milestone.description}</p>
                <p>Trạng thái: {milestone.status}</p>
                <p>Deadline: {milestone.deadline || 'Không có'}</p>

                <h4>Tasks</h4>

                {milestone.tasks?.map((task) => (
                <div key={task.id}>
                    <p>
                    <strong>{task.title}</strong>
                    </p>

                    <p>{task.description}</p>

                    <p>Ưu tiên: {task.priority}</p>
                    <p>Trạng thái: {task.status}</p>
                    <p>Deadline: {task.deadline || 'Không có'}</p>
                    <p>Thời gian dự kiến: {task.estimated_minutes} phút</p>

                    <hr />
                </div>
            ))}

    <hr />
  </div>
))}
    </div>
    )
}

export default GoalDetailPage