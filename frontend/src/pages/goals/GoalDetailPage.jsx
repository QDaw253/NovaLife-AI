import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteGoal, getGoal, updateTaskStatus } from '../../api/goals'

function GoalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [goal, setGoal] = useState(null)
  const [updatingTaskId, setUpdatingTaskId] = useState(null)
  const [message, setMessage] = useState('')

  const fetchGoal = async () => {
    const result = await getGoal(id)
    setGoal(result.data)
    return result.data
  }

  useEffect(() => {
    fetchGoal()
  }, [id])

  const handleDelete = async () => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa mục tiêu này không?')
    if (!confirmed) return
    await deleteGoal(id)
    navigate('/goals')
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chưa bắt đầu'
      case 'in_progress': return 'Đang thực hiện'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      default: return priority
    }
  }

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'study': return 'Học tập'
      case 'career': return 'Sự nghiệp'
      case 'health': return 'Sức khỏe'
      case 'personal': return 'Cá nhân'
      default: return category
    }
  }

  const handleTaskToggle = async (task) => {
    try {
      setUpdatingTaskId(task.id)
      setMessage('')
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      await updateTaskStatus(task.id, newStatus)
      const updatedGoal = await fetchGoal()

      if (newStatus === 'completed') {
        setMessage(`Đã hoàn thành "${task.title}". Tiến độ mục tiêu hiện tại: ${updatedGoal.progress}%.`)
      } else {
        setMessage(`Đã chuyển "${task.title}" về chưa hoàn thành. Tiến độ mục tiêu hiện tại: ${updatedGoal.progress}%.`)
      }
    } catch (error) {
      console.error('Update task error:', error)
      setMessage('Không thể cập nhật trạng thái nhiệm vụ.')
    } finally {
      setUpdatingTaskId(null)
    }
  }

  if (!goal) {
    return (
      <div className="goal-detail-state">
        <div className="goals-state-spinner" />
        <p>Đang tải mục tiêu...</p>
      </div>
    )
  }

  const progress = Math.min(Math.max(goal.progress || 0, 0), 100)

  return (
    <div className="goal-detail-page">
      <button className="goal-detail-back" type="button" onClick={() => navigate('/goals')}>
        ← Quay lại danh sách mục tiêu
      </button>

      <section className="goal-detail-hero">
        <div className="goal-detail-hero-main">
          <div className="goal-detail-badges">
            <span className="goal-detail-category">{getCategoryLabel(goal.category)}</span>
            <span className={`goal-detail-status goal-detail-status--${goal.status}`}>
              <span />
              {getStatusLabel(goal.status)}
            </span>
          </div>

          <h1>{goal.title}</h1>
          <p className="goal-detail-description">{goal.description || 'Không có mô tả'}</p>

          <div className="goal-detail-meta">
            <div className="goal-detail-meta-item">
              <span>Ưu tiên</span>
              <strong className={`goal-detail-priority goal-detail-priority--${goal.priority}`}>
                {getPriorityLabel(goal.priority)}
              </strong>
            </div>
            <div className="goal-detail-meta-item">
              <span>Deadline</span>
              <strong>{goal.deadline || 'Không có'}</strong>
            </div>
          </div>

          <div className="goal-detail-actions">
            <button className="goal-detail-edit" type="button" onClick={() => navigate(`/goals/${id}/edit`)}>
              <span>✎</span> Chỉnh sửa
            </button>
            <button className="goal-detail-delete" type="button" onClick={handleDelete}>
              Xóa mục tiêu
            </button>
          </div>
        </div>

        <div className="goal-detail-progress-card">
          <span className="goal-detail-progress-label">Tiến độ tổng thể</span>
          <div className="goal-detail-progress-value">
            {progress}<span>%</span>
          </div>
          <div className="goal-detail-progress-track">
            <div className="goal-detail-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p>{progress === 100 ? 'Mục tiêu đã hoàn thành.' : 'Tiếp tục hoàn thành các nhiệm vụ trong lộ trình.'}</p>
        </div>
      </section>

      <section className="goal-ai-plan">
        <div className="goal-ai-plan-heading">
          <div className="goal-ai-plan-icon">✦</div>
          <div>
            <span>NOVALIFE AI</span>
            <h2>Kế hoạch được đề xuất</h2>
            <p>Tổng quan lộ trình AI đã xây dựng cho mục tiêu này.</p>
          </div>
        </div>

        <div className="goal-ai-plan-stats">
          <div className="goal-ai-stat">
            <span>Độ khó</span>
            <strong>{goal.ai_plan?.difficulty || 'Không có'}</strong>
          </div>
          <div className="goal-ai-stat">
            <span>Thời lượng dự kiến</span>
            <strong>{goal.ai_plan?.estimated_duration || 'Không có'}</strong>
          </div>
          <div className="goal-ai-stat">
            <span>Khuyến nghị / tuần</span>
            <strong>{goal.ai_plan?.recommended_hours_per_week || 'Không có'}</strong>
          </div>
        </div>
      </section>

      {message && (
        <div className="goal-task-feedback">
          <span className="goal-task-feedback-icon">✓</span>
          <p>{message}</p>
        </div>
      )}

      <section className="goal-roadmap">
        <div className="goal-roadmap-heading">
          <div>
            <p className="goal-roadmap-eyebrow">Lộ trình</p>
            <h2>Các cột mốc của mục tiêu</h2>
            <p>Hoàn thành từng nhiệm vụ để tiến gần hơn đến mục tiêu của bạn.</p>
          </div>
          <span className="goal-roadmap-count">{goal.milestones?.length || 0} cột mốc</span>
        </div>

        {goal.milestones?.length > 0 ? (
          <div className="goal-milestone-list">
            {goal.milestones.map((milestone, milestoneIndex) => {
              const completedTasks = milestone.tasks?.filter((task) => task.status === 'completed').length || 0
              const totalTasks = milestone.tasks?.length || 0

              return (
                <article className="goal-milestone" key={milestone.id}>
                  <div className="goal-milestone-header">
                    <div className="goal-milestone-number">{String(milestoneIndex + 1).padStart(2, '0')}</div>
                    <div className="goal-milestone-info">
                      <div className="goal-milestone-title-row">
                        <h3>{milestone.title}</h3>
                        <span className={`goal-detail-status goal-detail-status--${milestone.status}`}>
                          <span />
                          {getStatusLabel(milestone.status)}
                        </span>
                      </div>
                      <p>{milestone.description || 'Không có mô tả'}</p>
                      <div className="goal-milestone-meta">
                        <span>Deadline: <strong>{milestone.deadline || 'Không có'}</strong></span>
                        <span><strong>{completedTasks}/{totalTasks}</strong> nhiệm vụ hoàn thành</span>
                      </div>
                    </div>
                  </div>

                  <div className="goal-task-section">
                    <div className="goal-task-section-heading">
                      <h4>Nhiệm vụ</h4>
                      <span>{totalTasks} nhiệm vụ</span>
                    </div>

                    {totalTasks > 0 ? (
                      <div className="goal-task-list">
                        {milestone.tasks.map((task, taskIndex) => {
                          const isCompleted = task.status === 'completed'
                          const isUpdating = updatingTaskId === task.id

                          return (
                            <div className={`goal-task-item ${isCompleted ? 'goal-task-item--completed' : ''}`} key={task.id}>
                              <label className="goal-task-check">
                                <input
                                  type="checkbox"
                                  checked={isCompleted}
                                  disabled={isUpdating}
                                  onChange={() => handleTaskToggle(task)}
                                />
                                <span className="goal-task-custom-check">✓</span>
                              </label>

                              <div className="goal-task-content">
                                <div className="goal-task-title-row">
                                  <div>
                                    <span className="goal-task-index">{String(taskIndex + 1).padStart(2, '0')}</span>
                                    <strong>{task.title}</strong>
                                  </div>
                                  {isUpdating && <span className="goal-task-updating">Đang cập nhật...</span>}
                                </div>
                                <p>{task.description || 'Không có mô tả'}</p>
                                <div className="goal-task-meta">
                                  <span>Ưu tiên: <strong>{getPriorityLabel(task.priority)}</strong></span>
                                  <span>Deadline: <strong>{task.deadline || 'Không có'}</strong></span>
                                  <span>Thời gian: <strong>{task.estimated_minutes || 0} phút</strong></span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="goal-task-empty">Milestone này chưa có nhiệm vụ.</div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="goal-roadmap-empty">
            <div>◎</div>
            <h3>Chưa có lộ trình</h3>
            <p>Mục tiêu này hiện chưa có milestone.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default GoalDetailPage