import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  getClothingItem,
  updateClothingItem,
} from '../../api/wardrobe'

function EditWardrobePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: 'top',
    color: '',
    season: 'all_season',
    occasion: 'versatile',
    is_favorite: false,
  })

  const [currentImage, setCurrentImage] = useState(null)
  const [newImage, setNewImage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const result = await getClothingItem(id)

        const item = result.data

        setFormData({
          name: item.name || '',
          category: item.category || 'top',
          color: item.color || '',
          season: item.season || 'all_season',
          occasion: item.occasion || 'versatile',
          is_favorite: item.is_favorite || false,
        })

        setCurrentImage(item.image || null)
      } catch (error) {
        console.error('Load wardrobe edit error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItem() }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0] || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()

    data.append('name', formData.name)
    data.append('category', formData.category)
    data.append('color', formData.color)
    data.append('season', formData.season)
    data.append('occasion', formData.occasion)
    data.append('is_favorite', formData.is_favorite)

    if (newImage) {
      data.append('image', newImage)
    }

    await updateClothingItem(id, data)

    navigate(`/wardrobe/${id}`)
  }

  if (loading) {
    return <p>Đang tải trang phục...</p>
  }

  return (
    <div>
      <h1>Chỉnh sửa trang phục</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên trang phục</label>
          <br />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
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
            <option value="top">Áo</option>
            <option value="bottom">Quần</option>
            <option value="shoes">Giày</option>
            <option value="outerwear">Áo khoác</option>
            <option value="accessory">Phụ kiện</option>
          </select>
        </div>

        <br />

        <div>
          <label>Màu sắc</label>
          <br />

          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn màu --</option>
            <option value="white">Trắng</option>
            <option value="black">Đen</option>
            <option value="gray">Xám</option>
            <option value="blue">Xanh dương</option>
            <option value="green">Xanh lá</option>
            <option value="red">Đỏ</option>
            <option value="yellow">Vàng</option>
            <option value="orange">Cam</option>
            <option value="pink">Hồng</option>
            <option value="purple">Tím</option>
            <option value="brown">Nâu</option>
            <option value="beige">Be</option>
          </select>
        </div>

        <br />

        <div>
          <label>Mùa</label>
          <br />

          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
          >
            <option value="spring">Mùa xuân</option>
            <option value="summer">Mùa hè</option>
            <option value="autumn">Mùa thu</option>
            <option value="winter">Mùa đông</option>
            <option value="all_season">Quanh năm</option>
          </select>
        </div>

        <br />

        <div>
          <label>Dịp sử dụng</label>
          <br />

          <select
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
          >
            <option value="casual">Hằng ngày</option>
            <option value="work">Đi làm</option>
            <option value="sport">Thể thao</option>
            <option value="party">Tiệc</option>
            <option value="formal">Trang trọng</option>
            <option value="versatile">Đa dụng</option>
          </select>
        </div>

        <br />

        <div>
          <label>
            <input
              type="checkbox"
              name="is_favorite"
              checked={formData.is_favorite}
              onChange={handleChange}
            />

            {' '}Yêu thích
          </label>
        </div>

        <br />

        {currentImage && (
          <div>
            <p>Ảnh hiện tại</p>

            <img
              src={currentImage}
              alt={formData.name || 'Trang phục'}
              width="200"
            />
          </div>
        )}

        <br />

        <div>
          <label>Chọn ảnh mới</label>
          <br />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
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

export default EditWardrobePage