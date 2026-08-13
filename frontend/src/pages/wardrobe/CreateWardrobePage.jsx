import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createClothingItem,
  analyzeClothingImage,
} from '../../api/wardrobe'

function CreateWardrobePage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: 'top',
    color: '',
    season: 'all_season',
    occasion: 'versatile',
    is_favorite: false,
  })

  const [image, setImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0]

    setImage(selectedImage)
    setAiMessage('')
  }

  const handleAnalyzeImage = async () => {
    if (!image) {
      setAiMessage('Vui lòng chọn ảnh trước khi phân tích.')
      return
    }

    try {
      setAnalyzing(true)
      setAiMessage('Đang phân tích ảnh bằng AI...')

      const result = await analyzeClothingImage(image)

        console.log('AI Vision result:', result)
        console.log('AI Vision data:', result.data)
        console.log('AI status:', result.data?.status)
        console.log('AI reason:', result.data?.reason)

      const aiData = result.data

      if (aiData.status !== 'success') {
        console.log('AI cannot analyze reason:', aiData.reason)

        setAiMessage(
            `AI không thể phân tích ảnh này. Lý do: ${
            aiData.reason || 'không xác định'
            }`
        )

        return
        }

      setFormData((currentData) => ({
        ...currentData,
        name: aiData.suggested_name || currentData.name,
        category: aiData.category || currentData.category,
        color: aiData.color || currentData.color,
        season: aiData.season || currentData.season,
        occasion: aiData.occasion || currentData.occasion,
      }))

      setAiMessage(
        'AI đã phân tích xong. Bạn có thể kiểm tra và chỉnh sửa gợi ý.'
      )
    } catch (error) {
      console.error('AI Vision error:', error)
      console.error('Status:', error.response?.status)
      console.error('Response:', error.response?.data)

      setAiMessage('Không thể phân tích ảnh bằng AI.')
    } finally {
      setAnalyzing(false)
    }
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

    if (image) {
      data.append('image', image)
    }

    await createClothingItem(data)

    navigate('/wardrobe')
  }

  return (
    <div>
      <h1>Thêm trang phục mới</h1>

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
          <label>Ảnh trang phục</label>
          <br />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <br />

        <button
          type="button"
          onClick={handleAnalyzeImage}
          disabled={analyzing || !image}
        >
          {analyzing
            ? 'Đang phân tích...'
            : '✨ Phân tích bằng AI'}
        </button>

        {aiMessage && (
          <p>{aiMessage}</p>
        )}

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

        <button type="submit">
          Tạo trang phục
        </button>
      </form>
    </div>
  )
}

export default CreateWardrobePage