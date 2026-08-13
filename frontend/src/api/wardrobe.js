import api from './axios'

export const getClothingItems = async () => {
  const response = await api.get('/wardrobe/items/')
  return response.data
}

export const getClothingItem = async (id) => {
  const response = await api.get(`/wardrobe/items/${id}/`)
  return response.data
}

export const createClothingItem = async (data) => {
  const response = await api.post(
    '/wardrobe/items/',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

export const updateClothingItem = async (id, data) => {
  const response = await api.patch(
    `/wardrobe/items/${id}/`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

export const deleteClothingItem = async (id) => {
  const response = await api.delete(
    `/wardrobe/items/${id}/`
  )

  return response.data
}

export const analyzeClothingImage = async (image) => {
  const formData = new FormData()

  formData.append('image', image)

  const response = await api.post(
    '/wardrobe/analyze-image/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

export const recommendOutfit = async (data) => {
  const response = await api.post(
    '/wardrobe/recommend-outfit/',
    data
  )

  return response.data
}