import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeClothingImage, createClothingItem } from '../../api/wardrobe'

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
  const [preview, setPreview] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [aiAnalyzed, setAiAnalyzed] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [analysisError, setAnalysisError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!image) {
      setPreview('')
      return
    }

    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [image])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    setError('')
  }

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0]
    if (!selectedImage) return

    setImage(selectedImage)
    setAiAnalyzed(false)
    setAiMessage('')
    setAnalysisError('')
    setError('')
    setFieldErrors((prev) => ({ ...prev, image: undefined }))
  }

  const handleRemoveImage = () => {
    setImage(null)
    setPreview('')
    setAiAnalyzed(false)
    setAiMessage('')
    setAnalysisError('')
    setError('')
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

  const handleAnalyzeImage = async () => {
    if (!image) {
      setAnalysisError('Vui lòng chọn ảnh trước khi sử dụng AI Vision.')
      return
    }

    try {
      setAnalyzing(true)
      setError('')
      setAnalysisError('')
      setAiMessage('')
      setAiAnalyzed(false)

      // wardrobe.js đã tự tạo FormData → chỉ truyền File
      const result = await analyzeClothingImage(image)
      const aiData = result.data

      console.log('AI Vision result:', aiData)

      if (aiData?.status !== 'success') {
        setAnalysisError(aiData?.message || aiData?.reason || 'AI chưa thể phân tích ảnh này.')
        return
      }

      setFormData((prev) => ({
        ...prev,
        name: aiData.suggested_name || prev.name,
        category: aiData.category || prev.category,
        color: aiData.color || prev.color,
        season: aiData.season || prev.season,
        occasion: aiData.occasion || prev.occasion,
      }))

      setFieldErrors({})
      setAiAnalyzed(true)
      setAiMessage('AI đã phân tích ảnh và điền các thông tin gợi ý. Bạn vẫn có thể chỉnh sửa trước khi lưu.')
    } catch (err) {
      console.error('Analyze image error:', err)

      const responseData = err.response?.data
      console.log('AI Vision backend error:', responseData)

      if (responseData?.errors && typeof responseData.errors === 'object') {
        const firstError = Object.values(responseData.errors).flat().find(Boolean)
        setAnalysisError(firstError || responseData?.message || 'Không thể phân tích ảnh.')
        return
      }

      setAnalysisError(responseData?.message || responseData?.reason || 'Không thể phân tích ảnh. Vui lòng thử lại.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      setError('')
      setFieldErrors({})

      const data = new FormData()

      data.append('name', formData.name)
      data.append('category', formData.category)
      data.append('color', formData.color)
      data.append('season', formData.season)
      data.append('occasion', formData.occasion)
      data.append('is_favorite', formData.is_favorite)

      if (image) data.append('image', image)

      await createClothingItem(data)
      navigate('/wardrobe')
    } catch (err) {
      console.error('Create clothing error:', err)

      const responseData = err.response?.data

      if (responseData?.errors && typeof responseData.errors === 'object') {
        setFieldErrors(responseData.errors)
        return
      }

      setError(responseData?.message || 'Không thể thêm trang phục. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="wardrobe-create-page">

      <header className="wardrobe-create-header">
        <button type="button" className="wardrobe-create-back" onClick={() => navigate('/wardrobe')}>
          ← Quay lại tủ đồ
        </button>

        <p className="wardrobe-create-eyebrow">THÊM TRANG PHỤC</p>
        <h1>Một món đồ mới</h1>
        <p>Thêm trang phục vào tủ đồ của bạn hoặc để AI Vision hỗ trợ nhận diện thông tin từ ảnh.</p>
      </header>

      <div className="wardrobe-create-layout">

        <form className="wardrobe-create-form" onSubmit={handleSubmit}>

          {/* IMAGE */}

          <section className="wardrobe-create-section">
            <div className="wardrobe-create-section-info">
              <span className="wardrobe-create-section-number">01</span>

              <div>
                <h2>Hình ảnh trang phục</h2>
                <p>Chọn một ảnh rõ ràng để lưu vào tủ đồ và sử dụng AI Vision.</p>
              </div>
            </div>

            <div className="wardrobe-create-section-fields">

              <div className={`wardrobe-create-image-box ${fieldErrors.image ? 'has-error' : ''}`}>
                {preview ? (
                  <>
                    <img src={preview} alt="Trang phục" />

                    <button type="button" className="wardrobe-create-remove-image" onClick={handleRemoveImage}>
                      ×
                    </button>
                  </>
                ) : (
                  <div className="wardrobe-create-image-empty">
                    <span>+</span>
                    <p>Chưa có hình ảnh</p>
                  </div>
                )}
              </div>

              {renderFieldError('image')}

              <label className="wardrobe-create-upload">
                {image ? 'Thay đổi hình ảnh' : 'Chọn ảnh'}
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} />
              </label>

              {image && (
                <button
                  type="button"
                  className="wardrobe-create-analyze"
                  onClick={handleAnalyzeImage}
                  disabled={analyzing}
                >
                  {analyzing ? 'AI đang phân tích...' : '✦ Phân tích bằng AI'}
                </button>
              )}

              {analysisError && <div className="wardrobe-analysis-error">{analysisError}</div>}

              {aiAnalyzed && aiMessage && (
                <div className="wardrobe-ai-success">
                  <span>✓</span>
                  <p>{aiMessage}</p>
                </div>
              )}

            </div>
          </section>


          {/* INFORMATION */}

          <section className="wardrobe-create-section">

            <div className="wardrobe-create-section-info">
              <span className="wardrobe-create-section-number">02</span>

              <div>
                <h2>Thông tin trang phục</h2>
                <p>Kiểm tra và chỉnh sửa thông tin trước khi lưu.</p>
              </div>
            </div>

            <div className="wardrobe-create-section-fields">

              {/* NAME */}

              <div className={`wardrobe-create-field ${fieldErrors.name ? 'has-error' : ''}`}>
                <label htmlFor="name">Tên trang phục <span>*</span></label>

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


              {/* CATEGORY + COLOR */}

              <div className="wardrobe-create-field-row">

                <div className={`wardrobe-create-field ${fieldErrors.category ? 'has-error' : ''}`}>
                  <label htmlFor="category">Loại trang phục <span>*</span></label>

                  <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                    <option value="top">Áo</option>
                    <option value="bottom">Quần</option>
                    <option value="shoes">Giày</option>
                    <option value="outerwear">Áo khoác</option>
                    <option value="accessory">Phụ kiện</option>
                  </select>

                  {renderFieldError('category')}
                </div>


                <div className={`wardrobe-create-field ${fieldErrors.color ? 'has-error' : ''}`}>
                  <label htmlFor="color">Màu sắc <span>*</span></label>

                  <select id="color" name="color" value={formData.color} onChange={handleChange} required>
                    {COLOR_OPTIONS.map((color) => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>

                  {renderFieldError('color')}
                </div>

              </div>


              {/* SEASON + OCCASION */}

              <div className="wardrobe-create-field-row">

                <div className={`wardrobe-create-field ${fieldErrors.season ? 'has-error' : ''}`}>
                  <label htmlFor="season">Mùa phù hợp <span>*</span></label>

                  <select id="season" name="season" value={formData.season} onChange={handleChange} required>
                    <option value="all_season">Mọi mùa</option>
                    <option value="spring">Mùa xuân</option>
                    <option value="summer">Mùa hè</option>
                    <option value="autumn">Mùa thu</option>
                    <option value="winter">Mùa đông</option>
                  </select>

                  {renderFieldError('season')}
                </div>


                <div className={`wardrobe-create-field ${fieldErrors.occasion ? 'has-error' : ''}`}>
                  <label htmlFor="occasion">Hoàn cảnh sử dụng <span>*</span></label>

                  <select id="occasion" name="occasion" value={formData.occasion} onChange={handleChange} required>
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


              {/* FAVORITE */}

              <label className="wardrobe-create-favorite">
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


          {/* GENERAL ERROR */}

          {error && <div className="wardrobe-create-error">{error}</div>}


          {/* ACTIONS */}

          <div className="wardrobe-create-actions">

            <button
              type="button"
              className="wardrobe-create-cancel"
              onClick={() => navigate('/wardrobe')}
              disabled={submitting}
            >
              Hủy
            </button>

            <button type="submit" className="wardrobe-create-submit" disabled={submitting}>
              {submitting ? 'Đang lưu...' : '+ Thêm vào tủ đồ'}
            </button>

          </div>

        </form>


        {/* AI GUIDE */}

        <aside className="wardrobe-create-guide">

          <div className="wardrobe-create-guide-icon">✦</div>

          <p className="wardrobe-create-guide-label">NOVALIFE VISION</p>

          <h2>AI có thể giúp bạn nhận diện trang phục.</h2>

          <p>
            Tải lên một ảnh rõ ràng và NovaLife sẽ gợi ý tên, loại,
            màu sắc, mùa và hoàn cảnh sử dụng.
          </p>

          <div className="wardrobe-create-guide-item">
            <span>01</span>

            <div>
              <strong>Một món đồ</strong>
              <p>Nên để một món trang phục chính trong ảnh.</p>
            </div>
          </div>

          <div className="wardrobe-create-guide-item">
            <span>02</span>

            <div>
              <strong>Ảnh đủ sáng</strong>
              <p>Tránh ảnh quá tối hoặc quá mờ.</p>
            </div>
          </div>

          <div className="wardrobe-create-guide-item">
            <span>03</span>

            <div>
              <strong>Kiểm tra lại</strong>
              <p>AI chỉ gợi ý. Bạn luôn có thể chỉnh sửa trước khi lưu.</p>
            </div>
          </div>

        </aside>

      </div>
    </div>
  )
}

export default CreateWardrobePage