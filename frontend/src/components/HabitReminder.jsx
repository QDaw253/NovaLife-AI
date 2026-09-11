import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHabitReminders } from '../api/habits'


function HabitReminder() {
  const navigate = useNavigate()

  const [reminders, setReminders] = useState([])
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined'
      ? Notification.permission
      : 'unsupported'
  )


  const getTodayKey = () => {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }


  const formatTime = (time) => {
    if (!time) return ''

    return time.slice(0, 5)
  }


  const showBrowserNotification = (habit) => {
    if (
      typeof Notification === 'undefined' ||
      Notification.permission !== 'granted'
    ) {
      return
    }

    const notificationKey =
      `novalife-habit-reminder-${habit.id}-${getTodayKey()}`

    if (localStorage.getItem(notificationKey)) {
      return
    }

    const notification = new Notification('NovaLife - Nhắc thói quen', {
      body: `Đến giờ thực hiện "${habit.title}".`,
      tag: notificationKey,
    })

    notification.onclick = () => {
      window.focus()
      navigate(`/habits/${habit.id}`)
      notification.close()
    }

    localStorage.setItem(notificationKey, 'shown')
  }


  const loadReminders = async (showToast = false) => {
    try {
      const result = await getHabitReminders()
      const data = result.data || []

      setReminders(data)

      if (data.length > 0) {
        data.forEach(showBrowserNotification)

        if (showToast) {
          setToast(
            data.length === 1
              ? ` Đến giờ thực hiện: ${data[0].title}`
              : ` Bạn có ${data.length} thói quen cần thực hiện.`
          )

          setTimeout(() => {
            setToast('')
          }, 5000)
        }
      }
    } catch (error) {
      console.error('Habit reminder error:', error)
    }
  }


  const enableBrowserNotification = async () => {
    if (typeof Notification === 'undefined') {
      setNotificationPermission('unsupported')
      return
    }

    const permission = await Notification.requestPermission()

    setNotificationPermission(permission)

    if (permission === 'granted') {
      reminders.forEach(showBrowserNotification)

      setToast(' Đã bật thông báo nhắc thói quen.')

      setTimeout(() => {
        setToast('')
      }, 4000)
    }
  }


  const handleReminderClick = (habit) => {
    setOpen(false)
    navigate(`/habits/${habit.id}`)
  }


  useEffect(() => {
    loadReminders(true)

    const interval = setInterval(() => {
      loadReminders(true)
    }, 60000)

    return () => clearInterval(interval)
  }, [])


  return (
    <>
      <div className="habit-reminder">
        <button
          type="button"
          className="habit-reminder-bell"
          onClick={() => setOpen(!open)}
          title="Nhắc nhở thói quen"
        >
          <span>🔔</span>

          {reminders.length > 0 && (
            <strong>
              {reminders.length > 9
                ? '9+'
                : reminders.length}
            </strong>
          )}
        </button>


        {open && (
          <div className="habit-reminder-panel">
            <div className="habit-reminder-header">
              <div>
                <p>NHẮC NHỞ</p>
                <h3>Thói quen hôm nay</h3>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>


            {reminders.length === 0 ? (
              <div className="habit-reminder-empty">
                <span>✓</span>

                <div>
                  <strong>Không có nhắc nhở</strong>
                  <p>
                    Bạn hiện không có thói quen nào
                    cần thực hiện.
                  </p>
                </div>
              </div>
            ) : (
              <div className="habit-reminder-list">
                {reminders.map((habit) => (
                  <button
                    key={habit.id}
                    type="button"
                    className="habit-reminder-item"
                    onClick={() => handleReminderClick(habit)}
                  >
                    <div className="habit-reminder-item-icon">
                      ✓
                    </div>

                    <div className="habit-reminder-item-info">
                      <strong>{habit.title}</strong>

                      <span>
                        Nhắc lúc {formatTime(habit.reminder_time)}
                      </span>

                      <small>
                        {habit.current}/{habit.target}{' '}
                        {habit.unit}
                        {' · '}
                        {habit.percentage}%
                      </small>
                    </div>

                    <span className="habit-reminder-arrow">
                      →
                    </span>
                  </button>
                ))}
              </div>
            )}


            {notificationPermission === 'default' && (
              <button
                type="button"
                className="habit-reminder-enable"
                onClick={enableBrowserNotification}
              >
                🔔 Bật thông báo trình duyệt
              </button>
            )}


            {notificationPermission === 'denied' && (
              <p className="habit-reminder-permission">
                Trình duyệt đang chặn thông báo.
                Bạn vẫn sẽ nhận nhắc nhở bên trong NovaLife.
              </p>
            )}
          </div>
        )}
      </div>


      {toast && (
        <div className="habit-reminder-toast">
          {toast}
        </div>
      )}
    </>
  )
}

export default HabitReminder