import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  getClothingItem,
  updateClothingItem,
} from '../../api/wardrobe'


const COLOR_OPTIONS = [
  { value: '', label: 'Chọn màu sắc' },
  { value: 'white', label: 'Trắng' },
  { value: 'black', label: 'Đen' },
  { value: 'gray', label: 'Xám' },
  { value: 'blue', label: 'Xanh dương' },
  { value: 'green', label: 'Xanh lá' },
  { value: 'red', label: 'Đỏ' },
  { value: 'yellow', label: 'Vàng' },
  { value: 'orange', label: 'Cam' },
  { value: 'pink', label: 'Hồng' },
  { value: 'purple', label: 'Tím' },
  { value: 'brown', label: 'Nâu' },
  { value: 'beige', label: 'Be' },
]


function EditWardrobePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [newImage, setNewImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})


  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true)
        setError('')

        const result = await getClothingItem(id)
        const item = result.data

        setFormData({
          name: item.name || '',
          category: item.category || 'top',
          color: item.color || '',
          season: item.season || 'all_season',
          occasion: item.occasion || 'versatile',
          is_favorite: Boolean(item.is_favorite),
        })

        setCurrentImage(item.image || '')
      } catch (err) {
        console.error('Load clothing item error:', err)
        setError('Không thể tải thông tin trang phục.')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])


  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    setError('')
  }


  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setNewImage(file)
    setPreviewUrl(URL.createObjectURL(file))
    setFieldErrors((prev) => ({ ...prev, image: undefined }))
  }


  const renderFieldError = (field) => {
    const messages = fieldErrors[field]
    if (!messages) return null

    const list = Array.isArray(messages) ? messages : [messages]

    return (
      <div className="wardrobe-field-error">
        {list.map((message, index) => <p key={index}>{message}</p>)}
      </div>
    )
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setFieldErrors({})

      const data = new FormData()

      data.append('name', formData.name)
      data.append('category', formData.category)
      data.append('color', formData.color)
      data.append('season', formData.season)
      data.append('occasion', formData.occasion)
      data.append('is_favorite', formData.is_favorite)

      if (newImage) data.append('image', newImage)

      await updateClothingItem(id, data)
      navigate(`/wardrobe/${id}`)
    } catch (err) {
      console.error('Update wardrobe error:', err)

      const responseData = err.response?.data

      if (responseData?.errors && typeof responseData.errors === 'object') {
        setFieldErrors(responseData.errors)
        return
      }

      setError(
        responseData?.message ||
        'Không thể lưu thay đổi. Vui lòng kiểm tra lại thông tin.'
      )
    } finally {
      setSaving(false)
    }
  }


  if (loading) {
    return (
      <div className="wardrobe-edit-state">
        <div className="wardrobe-edit-loader" />
        <h2>Đang tải trang phục...</h2>
        <p>NovaLife đang chuẩn bị thông tin của bạn.</p>
      </div>
    )
  }


  if (!formData) {
    return (
      <div className="wardrobe-edit-state">
        <h2>Không thể tải trang phục</h2>
        <p>Vui lòng quay lại và thử lại.</p>

        <button type="button" onClick={() => navigate('/wardrobe')}>
          ← Quay lại tủ đồ
        </button>
      </div>
    )
  }


  const displayedImage = previewUrl || currentImage


  return (
    <div className="wardrobe-edit-page">

      <header className="wardrobe-edit-header">
        <button
          type="button"
          className="wardrobe-edit-back"
          onClick={() => navigate(`/wardrobe/${id}`)}
        >
          ← Quay lại chi tiết
        </button>

        <p className="wardrobe-edit-eyebrow">CHỈNH SỬA</p>
        <h1>Chỉnh sửa trang phục</h1>

        <p>
          Cập nhật thông tin để tủ đồ NovaLife luôn phản ánh
          chính xác những món đồ bạn đang sở hữu.
        </p>
      </header>


      <div className="wardrobe-edit-layout">

        <form className="wardrobe-edit-form" onSubmit={handleSubmit}>

          {/* IMAGE */}

          <section className="wardrobe-edit-section">
            <div className="wardrobe-edit-section-info">
              <span className="wardrobe-edit-section-number">01</span>

              <div>
                <h2>Hình ảnh</h2>
                <p>Bạn có thể giữ ảnh hiện tại hoặc thay bằng ảnh mới.</p>
              </div>
            </div>

            <div className="wardrobe-edit-fields">

              <div className={`wardrobe-edit-image ${fieldErrors.image ? 'has-error' : ''}`}>
                {displayedImage ? (
                  <img src={displayedImage} alt={formData.name} />
                ) : (
                  <div className="wardrobe-edit-image-empty">
                    <span>＋</span>
                    <p>Chưa có hình ảnh</p>
                  </div>
                )}
              </div>

              {renderFieldError('image')}

              <label className="wardrobe-edit-upload">
                Thay đổi ảnh
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>

            </div>
          </section>


          {/* INFORMATION */}

          <section className="wardrobe-edit-section">
            <div className="wardrobe-edit-section-info">
              <span className="wardrobe-edit-section-number">02</span>

              <div>
                <h2>Thông tin trang phục</h2>
                <p>Điều chỉnh thông tin của món đồ.</p>
              </div>
            </div>

            <div className="wardrobe-edit-fields">

              <div className={`wardrobe-edit-field wardrobe-edit-field-full ${fieldErrors.name ? 'has-error' : ''}`}>
                <label htmlFor="name">
                  Tên trang phục <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Áo thun trắng"
                  required
                />

                {renderFieldError('name')}
              </div>


              <div className="wardrobe-edit-field-row">

                <div className={`wardrobe-edit-field ${fieldErrors.category ? 'has-error' : ''}`}>
                  <label htmlFor="category">
                    Loại trang phục <span>*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="top">Áo</option>
                    <option value="bottom">Quần</option>
                    <option value="shoes">Giày</option>
                    <option value="outerwear">Áo khoác</option>
                    <option value="accessory">Phụ kiện</option>
                  </select>

                  {renderFieldError('category')}
                </div>


                <div className={`wardrobe-edit-field ${fieldErrors.color ? 'has-error' : ''}`}>
                  <label htmlFor="color">
                    Màu sắc <span>*</span>
                  </label>

                  <select
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                  >
                    {COLOR_OPTIONS.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>

                  {renderFieldError('color')}
                </div>

              </div>


              <div className="wardrobe-edit-field-row">

                <div className={`wardrobe-edit-field ${fieldErrors.season ? 'has-error' : ''}`}>
                  <label htmlFor="season">
                    Mùa phù hợp <span>*</span>
                  </label>

                  <select
                    id="season"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                  >
                    <option value="all_season">Mọi mùa</option>
                    <option value="spring">Mùa xuân</option>
                    <option value="summer">Mùa hè</option>
                    <option value="autumn">Mùa thu</option>
                    <option value="winter">Mùa đông</option>
                  </select>

                  {renderFieldError('season')}
                </div>


                <div className={`wardrobe-edit-field ${fieldErrors.occasion ? 'has-error' : ''}`}>
                  <label htmlFor="occasion">
                    Hoàn cảnh sử dụng <span>*</span>
                  </label>

                  <select
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    required
                  >
                    <option value="versatile">Đa dụng</option>
                    <option value="casual">Hằng ngày</option>
                    <option value="work">Công việc</option>
                    <option value="sport">Thể thao</option>
                    <option value="party">Tiệc</option>
                    <option value="formal">Trang trọng</option>
                  </select>

                  {renderFieldError('occasion')}
                </div>

              </div>


              <label className="wardrobe-edit-favorite">
                <input
                  type="checkbox"
                  name="is_favorite"
                  checked={formData.is_favorite}
                  onChange={handleChange}
                />

                <span>Đánh dấu là trang phục yêu thích</span>
              </label>

            </div>
          </section>


          {error && (
            <div className="wardrobe-edit-error">
              {error}
            </div>
          )}


          <div className="wardrobe-edit-actions">
            <button
              type="button"
              className="wardrobe-edit-cancel"
              onClick={() => navigate(`/wardrobe/${id}`)}
              disabled={saving}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="wardrobe-edit-submit"
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : '✓ Lưu thay đổi'}
            </button>
          </div>

        </form>


        <aside className="wardrobe-edit-guide">
          <div className="wardrobe-edit-guide-icon">✎</div>

          <p className="wardrobe-edit-guide-label">NOVALIFE WARDROBE</p>

          <h2>Giữ tủ đồ của bạn luôn chính xác.</h2>

          <p>
            Thông tin trang phục càng chính xác thì các module AI
            sử dụng tủ đồ sau này càng có dữ liệu tốt hơn.
          </p>

          <div className="wardrobe-edit-guide-item">
            <span>01</span>

            <div>
              <strong>Tên rõ ràng</strong>
              <p>Ví dụ: Áo thun trắng, Quần jean xanh.</p>
            </div>
          </div>

          <div className="wardrobe-edit-guide-item">
            <span>02</span>

            <div>
              <strong>Màu chính xác</strong>
              <p>Chọn màu gần nhất với màu thực tế của trang phục.</p>
            </div>
          </div>

          <div className="wardrobe-edit-guide-item">
            <span>03</span>

            <div>
              <strong>Đúng hoàn cảnh</strong>
              <p>Giúp NovaLife hiểu món đồ phù hợp khi nào.</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}


export default EditWardrobePage