import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  analyzeClothingImage,
  createClothingItem,
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
  const [preview, setPreview] = useState('')

  const [analyzing, setAnalyzing] = useState(false)
  const [aiAnalyzed, setAiAnalyzed] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')


  // =========================================
  // IMAGE PREVIEW
  // =========================================

  useEffect(() => {
    if (!image) {
      setPreview('')
      return
    }

    const objectUrl = URL.createObjectURL(image)

    setPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [image])


  // =========================================
  // HANDLE FORM
  // =========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))
  }


  // =========================================
  // HANDLE IMAGE
  // =========================================

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0]

    if (!selectedImage) {
      return
    }

    setImage(selectedImage)

    // Ảnh mới -> kết quả AI cũ không còn ý nghĩa.
    setAiAnalyzed(false)
    setAiMessage('')
    setError('')
  }


  // =========================================
  // REMOVE IMAGE
  // =========================================

  const handleRemoveImage = () => {
    setImage(null)

    setAiAnalyzed(false)
    setAiMessage('')
    setError('')
  }


  // =========================================
  // AI VISION
  // =========================================

  const handleAnalyzeImage = async () => {
    if (!image) {
      setError(
        'Vui lòng chọn ảnh trước khi sử dụng AI Vision.'
      )

      return
    }

    try {
      setAnalyzing(true)
      setError('')
      setAiMessage('')
      setAiAnalyzed(false)

      const result = await analyzeClothingImage(image)

      const aiData = result.data

      if (aiData?.status !== 'success') {
        setError(
          aiData?.reason ||
            'AI chưa thể phân tích ảnh này.'
        )

        return
      }

      setFormData((previousData) => ({
        ...previousData,

        name:
          aiData.suggested_name ||
          previousData.name,

        category:
          aiData.category ||
          previousData.category,

        color:
          aiData.color ||
          previousData.color,

        season:
          aiData.season ||
          previousData.season,

        occasion:
          aiData.occasion ||
          previousData.occasion,
      }))

      setAiAnalyzed(true)

      setAiMessage(
        'AI đã phân tích ảnh và điền các thông tin gợi ý. Bạn vẫn có thể chỉnh sửa trước khi lưu.'
      )
    } catch (err) {
      console.error('Analyze image error:', err)

      const responseData = err.response?.data

      setError(
        responseData?.message ||
          responseData?.reason ||
          'Không thể phân tích ảnh. Vui lòng thử lại.'
      )
    } finally {
      setAnalyzing(false)
    }
  }


  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      setError('')

      const data = new FormData()

      data.append('name', formData.name)
      data.append('category', formData.category)
      data.append('color', formData.color)
      data.append('season', formData.season)
      data.append('occasion', formData.occasion)

      data.append(
        'is_favorite',
        formData.is_favorite
      )

      if (image) {
        data.append('image', image)
      }

      await createClothingItem(data)

      navigate('/wardrobe')
    } catch (err) {
      console.error('Create clothing error:', err)

      const responseData = err.response?.data

      setError(
        responseData?.message ||
          'Không thể thêm trang phục. Vui lòng kiểm tra lại thông tin.'
      )
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="wardrobe-create-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="wardrobe-create-header">

        <button
          type="button"
          className="wardrobe-create-back"
          onClick={() => navigate('/wardrobe')}
        >
          ← Quay lại tủ đồ
        </button>


        <p className="wardrobe-create-eyebrow">
          THÊM TRANG PHỤC
        </p>

        <h1>Một món đồ mới</h1>

        <p className="wardrobe-create-subtitle">
          Thêm trang phục vào tủ đồ của bạn hoặc để
          AI Vision hỗ trợ nhận diện thông tin từ ảnh.
        </p>

      </header>


      {/* =====================================
          MAIN
      ====================================== */}

      <form
        className="wardrobe-create-layout"
        onSubmit={handleSubmit}
      >

        {/* ===================================
            LEFT - IMAGE + AI
        ==================================== */}

        <div className="wardrobe-create-left">

          <section className="wardrobe-create-image-card">

            <div className="wardrobe-create-section-heading">

              <div className="wardrobe-create-step">
                01
              </div>

              <div>
                <h2>Hình ảnh trang phục</h2>

                <p>
                  Chọn một ảnh rõ ràng để lưu vào
                  tủ đồ và sử dụng AI Vision.
                </p>
              </div>

            </div>


            {/* IMAGE */}

            <div
              className={
                preview
                  ? 'wardrobe-create-preview has-image'
                  : 'wardrobe-create-preview'
              }
            >

              {preview ? (
                <img
                  src={preview}
                  alt="Trang phục được chọn"
                />
              ) : (
                <div className="wardrobe-create-placeholder">

                  <div className="wardrobe-create-placeholder-icon">
                    ◇
                  </div>

                  <strong>
                    Thêm hình ảnh
                  </strong>

                  <p>
                    Chọn ảnh rõ toàn bộ trang phục
                    để AI nhận diện tốt hơn.
                  </p>

                </div>
              )}


              {preview && (
                <button
                  type="button"
                  className="wardrobe-create-remove-image"
                  onClick={handleRemoveImage}
                  title="Xóa ảnh"
                >
                  ×
                </button>
              )}

            </div>


            {/* FILE INPUT */}

            <label className="wardrobe-create-upload">

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <span className="wardrobe-create-upload-icon">
                +
              </span>

              <div>
                <strong>
                  {image
                    ? 'Thay đổi hình ảnh'
                    : 'Chọn hình ảnh'}
                </strong>

                <small>
                  JPG, PNG hoặc ảnh từ thiết bị
                </small>
              </div>

            </label>

          </section>


          {/* =================================
              AI VISION
          ================================== */}

          <section
            className={
              aiAnalyzed
                ? 'wardrobe-ai-vision-card analyzed'
                : 'wardrobe-ai-vision-card'
            }
          >

            <div className="wardrobe-ai-vision-top">

              <div className="wardrobe-ai-vision-icon">
                ✦
              </div>

              <div>
                <p>AI VISION</p>

                <h3>
                  Phân tích trang phục
                </h3>
              </div>

            </div>


            <p className="wardrobe-ai-vision-description">
              NovaLife có thể quan sát hình ảnh và
              gợi ý tên, loại trang phục, màu sắc,
              mùa và hoàn cảnh sử dụng.
            </p>


            <div className="wardrobe-ai-vision-note">

              <span>i</span>

              <p>
                AI chỉ đưa ra gợi ý. Bạn luôn có thể
                kiểm tra và chỉnh sửa thông tin trước
                khi lưu vào tủ đồ.
              </p>

            </div>


            <button
              type="button"
              className="wardrobe-ai-analyze-button"
              onClick={handleAnalyzeImage}
              disabled={!image || analyzing}
            >

              {analyzing ? (
                <>
                  <span className="wardrobe-ai-small-spinner" />

                  Đang phân tích...
                </>
              ) : aiAnalyzed ? (
                <>
                  ✦ Phân tích lại
                </>
              ) : (
                <>
                  ✦ Phân tích bằng AI
                </>
              )}

            </button>


            {aiMessage && (
              <div className="wardrobe-ai-success">

                <span>✓</span>

                <p>{aiMessage}</p>

              </div>
            )}

          </section>

        </div>


        {/* ===================================
            RIGHT - FORM
        ==================================== */}

        <section className="wardrobe-create-form-card">

          <div className="wardrobe-create-section-heading">

            <div className="wardrobe-create-step">
              02
            </div>

            <div>
              <h2>Thông tin trang phục</h2>

              <p>
                Kiểm tra và điều chỉnh thông tin
                trước khi thêm vào tủ đồ.
              </p>
            </div>

          </div>


          {aiAnalyzed && (
            <div className="wardrobe-ai-form-badge">

              <span>✦</span>

              <p>
                Một số thông tin bên dưới đang sử dụng
                gợi ý từ AI Vision.
              </p>

            </div>
          )}


          <div className="wardrobe-create-fields">

            {/* NAME */}

            <div className="wardrobe-create-field">

              <label htmlFor="name">
                Tên trang phục <span>*</span>
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Áo thun trắng"
                required
              />

            </div>


            {/* CATEGORY */}

            <div className="wardrobe-create-field">

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
                <option value="top">
                  Áo
                </option>

                <option value="bottom">
                  Quần
                </option>

                <option value="shoes">
                  Giày
                </option>

                <option value="outerwear">
                  Áo khoác
                </option>

                <option value="accessory">
                  Phụ kiện
                </option>
              </select>

            </div>


            {/* COLOR */}

            <div className="wardrobe-create-field">
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
                <option value="">
                  Chọn màu sắc
                </option>

                <option value="white">
                  Trắng
                </option>

                <option value="black">
                  Đen
                </option>

                <option value="gray">
                  Xám
                </option>

                <option value="blue">
                  Xanh dương
                </option>

                <option value="green">
                  Xanh lá
                </option>

                <option value="red">
                  Đỏ
                </option>

                <option value="yellow">
                  Vàng
                </option>

                <option value="orange">
                  Cam
                </option>

                <option value="pink">
                  Hồng
                </option>

                <option value="purple">
                  Tím
                </option>

                <option value="brown">
                  Nâu
                </option>

                <option value="beige">
                  Be
                </option>
              </select>
            </div>


            {/* SEASON */}

            <div className="wardrobe-create-field">

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
                <option value="all_season">
                  Mọi mùa
                </option>

                <option value="spring">
                  Mùa xuân
                </option>

                <option value="summer">
                  Mùa hè
                </option>

                <option value="autumn">
                  Mùa thu
                </option>

                <option value="winter">
                  Mùa đông
                </option>
              </select>

            </div>


            {/* OCCASION */}

            <div className="wardrobe-create-field">

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
                <option value="versatile">
                  Đa dụng
                </option>

                <option value="casual">
                  Hằng ngày
                </option>

                <option value="work">
                  Công việc
                </option>

                <option value="sport">
                  Thể thao
                </option>

                <option value="party">
                  Tiệc
                </option>

                <option value="formal">
                  Trang trọng
                </option>
              </select>

            </div>


            {/* FAVORITE */}

            <label className="wardrobe-create-favorite">

              <input
                type="checkbox"
                name="is_favorite"
                checked={formData.is_favorite}
                onChange={handleChange}
              />

              <span className="wardrobe-create-favorite-box">
                ♥
              </span>

              <div>
                <strong>
                  Trang phục yêu thích
                </strong>

                <p>
                  Đánh dấu nếu đây là một trong
                  những món đồ bạn thường ưu tiên.
                </p>
              </div>

            </label>

          </div>


          {/* =================================
              ERROR
          ================================== */}

          {error && (
            <div className="wardrobe-create-error">
              {error}
            </div>
          )}


          {/* =================================
              ACTIONS
          ================================== */}

          <div className="wardrobe-create-actions">

            <button
              type="button"
              className="wardrobe-create-cancel"
              onClick={() => navigate('/wardrobe')}
              disabled={submitting}
            >
              Hủy
            </button>


            <button
              type="submit"
              className="wardrobe-create-submit"
              disabled={submitting}
            >
              {submitting
                ? 'Đang lưu...'
                : '+ Thêm vào tủ đồ'}
            </button>

          </div>

        </section>

      </form>

    </div>
  )
}


export default CreateWardrobePage