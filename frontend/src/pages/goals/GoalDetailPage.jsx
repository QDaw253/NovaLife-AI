import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  deleteGoal,
  getGoal,
  updateTaskStatus
} from '../../api/goals'


function GoalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [goal, setGoal] = useState(null)

  const [updatingTaskId, setUpdatingTaskId] =
    useState(null)

    const [message, setMessage] = useState('')


  // =========================================
  // LOAD GOAL DETAIL
  // =========================================
  const fetchGoal = async () => {
    const result = await getGoal(id)

    setGoal(result.data)

    return result.data }


    useEffect(() => { fetchGoal() }, [id])


  // =========================================
  // DELETE GOAL
  // =========================================
  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Bạn có chắc muốn xóa mục tiêu này không?'
    )

    if (!confirmed) {
      return
    }

    await deleteGoal(id)

    navigate('/goals')
  }


  // =========================================
  // LABEL HELPERS
  // =========================================
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Chưa bắt đầu'

      case 'in_progress':
        return 'Đang thực hiện'

      case 'completed':
        return 'Hoàn thành'

      case 'cancelled':
        return 'Đã hủy'

      default:
        return status
    }
  }


  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'low':
        return 'Thấp'

      case 'medium':
        return 'Trung bình'

      case 'high':
        return 'Cao'

      default:
        return priority
    }
  }

  const handleTaskToggle = async (task) => {
    try {
        setUpdatingTaskId(task.id)
        setMessage('')

        const newStatus =
        task.status === 'completed'
            ? 'pending'
            : 'completed'

        await updateTaskStatus(
        task.id,
        newStatus
        )

        const updatedGoal = await fetchGoal()

        if (newStatus === 'completed') {
        setMessage(
            `✅ Đã hoàn thành "${task.title}". ` +
            `Tiến độ mục tiêu hiện tại: ${updatedGoal.progress}%.`
        )
        } else {
        setMessage(
            `↩️ Đã chuyển "${task.title}" về chưa hoàn thành. ` +
            `Tiến độ mục tiêu hiện tại: ${updatedGoal.progress}%.`
        )
        }
    } catch (error) {
        console.error(
        'Update task error:',
        error
        )

        setMessage(
        'Không thể cập nhật trạng thái nhiệm vụ.'
        )
    } finally {
        setUpdatingTaskId(null)
    }
    }


  // =========================================
  // LOADING
  // =========================================
  if (!goal) {
    return <p>Đang tải mục tiêu...</p>
  }


  return (
    <div>
      {/* =====================================
          GOAL INFORMATION
      ====================================== */}

      <section>
        <h1>🎯 {goal.title}</h1>

        <p>
          {goal.description || 'Không có mô tả'}
        </p>

        <p>
          Danh mục: {goal.category}
        </p>

        <p>
          Ưu tiên:{' '}
          {getPriorityLabel(goal.priority)}
        </p>

        <p>
          Trạng thái:{' '}
          {getStatusLabel(goal.status)}
        </p>

        <p>
          Tiến độ:{' '}
          <strong>{goal.progress}%</strong>
        </p>

        <progress
          value={goal.progress || 0}
          max="100"
        />

        <p>
          Deadline:{' '}
          {goal.deadline || 'Không có'}
        </p>

        <button
          type="button"
          onClick={handleDelete}
        >
          Xóa mục tiêu
        </button>
      </section>


      <hr />


      {/* =====================================
          AI PLAN
      ====================================== */}

      <section>
        <h2>🤖 Kế hoạch AI</h2>

        <p>
          Độ khó:{' '}
          {goal.ai_plan?.difficulty || 'Không có'}
        </p>

        <p>
          Thời lượng dự kiến:{' '}
          {goal.ai_plan?.estimated_duration || 'Không có'}
        </p>

        <p>
          Số giờ / tuần:{' '}
          {goal.ai_plan?.recommended_hours_per_week || 'Không có'}
        </p>
      </section>


      <hr />

      {message && (<> 
        <p> <strong>{message}</strong> </p> 
        <hr /> 
        </>)}


      {/* =====================================
          MILESTONES
      ====================================== */}

      <section>
        <h2>🗺️ Lộ trình mục tiêu</h2>

        {goal.milestones?.length > 0 ? (
          goal.milestones.map(
            (milestone, milestoneIndex) => (
              <div key={milestone.id}>

                {/* ===========================
                    MILESTONE
                ============================ */}

                <h3>
                  MILESTONE {milestoneIndex + 1}
                </h3>

                <h2>
                  {milestone.title}
                </h2>

                <p>
                  {milestone.description ||
                    'Không có mô tả'}
                </p>

                <p>
                  Trạng thái:{' '}
                  <strong>
                    {getStatusLabel(
                      milestone.status
                    )}
                  </strong>
                </p>

                <p>
                  Deadline:{' '}
                  {milestone.deadline ||
                    'Không có'}
                </p>


                {/* ===========================
                    TASKS
                ============================ */}

                <h4>
                  📋 Các nhiệm vụ
                </h4>

                <p>
                  Tổng số nhiệm vụ:{' '}
                  {milestone.tasks?.length || 0}
                </p>

                {milestone.tasks?.length > 0 ? (
                  milestone.tasks.map(
                    (task, taskIndex) => (
                      <div key={task.id}>

                        <div>
                            <label>
                                <input
                                type="checkbox"
                                checked={
                                    task.status === 'completed'
                                }
                                disabled={
                                    updatingTaskId === task.id
                                }
                                onChange={() =>
                                    handleTaskToggle(task)
                                }
                                />

                                {' '}

                                <strong>
                                {taskIndex + 1}. {task.title}
                                </strong>
                            </label>

                            {updatingTaskId === task.id && (
                                <span>
                                {' '}Đang cập nhật...
                                </span>
                            )}
                            </div>

                        <p>
                          {task.description ||
                            'Không có mô tả'}
                        </p>

                        <p>
                          Ưu tiên:{' '}
                          {getPriorityLabel(
                            task.priority
                          )}
                        </p>

                        <p>
                          Trạng thái:{' '}
                          {getStatusLabel(
                            task.status
                          )}
                        </p>

                        <p>
                          Deadline:{' '}
                          {task.deadline ||
                            'Không có'}
                        </p>

                        <p>
                          Thời gian dự kiến:{' '}
                          {task.estimated_minutes}{' '}
                          phút
                        </p>

                        <br />
                      </div>
                    )
                  )
                ) : (
                  <p>
                    Milestone này chưa có
                    nhiệm vụ.
                  </p>
                )}

                <hr />
              </div>
            )
          )
        ) : (
          <p>
            Mục tiêu này chưa có milestone.
          </p>
        )}
      </section>
    </div>
  )
}

export default GoalDetailPage