import api from './axios'


export const getGoals = async () => {
  const response = await api.get('/goals/')

  return response.data
}


export const getGoal = async (id) => {
  const response = await api.get(
    `/goals/${id}/`
  )

  return response.data
}


export const createGoal = async (data) => {
  const response = await api.post(
    '/goals/',
    data
  )

  return response.data
}


export const updateGoal = async (
  id,
  data
) => {
  const response = await api.patch(
    `/goals/${id}/`,
    data
  )

  return response.data
}


export const deleteGoal = async (id) => {
  const response = await api.delete(
    `/goals/${id}/`
  )

  return response.data
}


// =========================================
// UPDATE TASK STATUS
// =========================================

export const updateTaskStatus = async (
  taskId,
  status
) => {
  const response = await api.patch(
    `/goals/tasks/${taskId}/`,
    {
      status,
    }
  )

  return response.data
}