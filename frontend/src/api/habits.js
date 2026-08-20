import api from './axios'

export const getHabits = async () => {
  const response = await api.get('/habits/')
  return response.data
}

export const getHabit = async (id) => {
  const response = await api.get(`/habits/${id}/`)
  return response.data
}

export const createHabit = async (data) => {
  const response = await api.post('/habits/', data)
  return response.data
}

export const updateHabit = async (id, data) => {
  const response = await api.patch(`/habits/${id}/`, data)
  return response.data
}

export const deleteHabit = async (id) => {
  const response = await api.delete(`/habits/${id}/`)
  return response.data
}

export const completeHabitToday = async (id, data) => {
  const response = await api.post(`/habits/${id}/complete-today/`, data)
  return response.data
}

export const getHabitReminders = async () => {
  const response = await api.get('/habits/reminders/')
  return response.data
}