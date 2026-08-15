import { useEffect, useMemo, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  getClothingItem,
  updateClothingItem,
} from '../../api/wardrobe'


const CATEGORY_OPTIONS = [
  { value: 'top', label: 'Áo' },
  { value: 'bottom', label: 'Quần' },
  { value: 'shoes', label: 'Giày' },
  { value: 'outerwear', label: 'Áo khoác' },
  { value: 'accessory', label: 'Phụ kiện' },
]


const COLOR_OPTIONS = [
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


const SEASON_OPTIONS = [
  { value: 'spring', label: 'Mùa xuân' },
  { value: 'summer', label: 'Mùa hè' },
  { value: 'autumn', label: 'Mùa thu' },
  { value: 'winter', label: 'Mùa đông' },
  { value: 'all_season', label: 'Mọi mùa' },
]


const OCCASION_OPTIONS = [
  { value: 'casual', label: 'Hằng ngày' },
  { value: 'work', label: 'Đi làm' },
  { value: 'sport', label: 'Thể thao' },
  { value: 'party', label: 'Tiệc' },
  { value: 'formal', label: 'Trang trọng' },
  { value: 'versatile', label: 'Đa dụng' },
]


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

  const [currentImage, setCurrentImage] =
    useState(null)

  const [newImage, setNewImage] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')


  /* =========================================
     LOAD ITEM
     ========================================= */

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true)
        setError('')

        const result =
          await getClothingItem(id)

        const item = result.data

        setFormData({
          name: item.name || '',
          category:
            item.category || 'top',
          color: item.color || '',
          season:
            item.season || 'all_season',
          occasion:
            item.occasion || 'versatile',
          is_favorite:
            Boolean(item.is_favorite),
        })

        setCurrentImage(
          item.image || null
        )
      } catch (error) {
        console.error(
          'Load wardrobe edit error:',
          error
        )

        setError(
          'Không thể tải thông tin trang phục.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])


  /* =========================================
     IMAGE PREVIEW
     ========================================= */

  const previewImage = useMemo(() => {
    if (!newImage) {
      return currentImage
    }

    return URL.createObjectURL(
      newImage
    )
  }, [newImage, currentImage])


  useEffect(() => {
    return () => {
      if (
        newImage &&
        previewImage &&
        previewImage.startsWith('blob:')
      ) {
        URL.revokeObjectURL(
          previewImage
        )
      }
    }
  }, [newImage, previewImage])


  /* =========================================
     FORM CHANGE
     ========================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))
  }


  /* =========================================
     IMAGE CHANGE
     ========================================= */

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0]

    if (!file) {
      return
    }

    setNewImage(file)
  }


  const handleCancelNewImage = () => {
    setNewImage(null)
  }


  /* =========================================
     SUBMIT
     ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')

      const data =
        new FormData()

      data.append(
        'name',
        formData.name
      )

      data.append(
        'category',
        formData.category
      )

      data.append(
        'color',
        formData.color
      )

      data.append(
        'season',
        formData.season
      )

      data.append(
        'occasion',
        formData.occasion
      )

      data.append(
        'is_favorite',
        formData.is_favorite
      )

      if (newImage) {
        data.append(
          'image',
          newImage
        )
      }

      await updateClothingItem(
        id,
        data
      )

      navigate(
        `/wardrobe/${id}`
      )
    } catch (error) {
      console.error(
        'Update wardrobe error:',
        error
      )

      console.error(
        'Response:',
        error.response?.data
      )

      setError(
        'Không thể lưu thay đổi. Vui lòng kiểm tra lại thông tin.'
      )
    } finally {
      setSaving(false)
    }
  }


  /* =========================================
     LOADING
     ========================================= */

  if (loading) {
    return (
      <div className="wardrobe-edit-page">
        <div className="wardrobe-edit-state">
          Đang tải trang phục...
        </div>
      </div>
    )
  }


  /* =========================================
     LOAD ERROR
     ========================================= */

  if (
    error &&
    !currentImage &&
    !formData.name
  ) {
    return (
      <div className="wardrobe-edit-page">
        <div className="wardrobe-edit-state">
          <p>{error}</p>

          <Link
            to={`/wardrobe/${id}`}
            className="wardrobe-edit-back"
          >
            ← Quay lại trang phục
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="wardrobe-edit-page">

      {/* BACK */}

      <Link
        to={`/wardrobe/${id}`}
        className="wardrobe-edit-back"
      >
        ← Quay lại trang phục
      </Link>


      {/* HEADER */}

      <div className="wardrobe-edit-header">

        <p className="wardrobe-edit-eyebrow">
          CHỈNH SỬA TỦ ĐỒ
        </p>

        <h1>
          Chỉnh sửa trang phục
        </h1>

        <p>
          Cập nhật hình ảnh và thông tin
          của món đồ trong tủ đồ NovaLife.
        </p>

      </div>


      <form
        className="wardrobe-edit-layout"
        onSubmit={handleSubmit}
      >

        {/* =====================================
            LEFT - IMAGE
            ===================================== */}

        <section className="wardrobe-edit-image-card">

          <div className="wardrobe-edit-card-heading">

            <div className="wardrobe-edit-number">
              01
            </div>

            <div>
              <h2>
                Hình ảnh trang phục
              </h2>

              <p>
                Giữ ảnh hiện tại hoặc
                thay bằng một hình ảnh mới.
              </p>
            </div>

          </div>


          <div className="wardrobe-edit-image-preview">

            {previewImage ? (
              <img
                src={previewImage}
                alt={
                  formData.name ||
                  'Trang phục'
                }
              />
            ) : (
              <div className="wardrobe-edit-empty-image">
                <span>◇</span>

                <p>
                  Chưa có hình ảnh
                </p>
              </div>
            )}

          </div>


          <label className="wardrobe-edit-upload">

            <span className="wardrobe-edit-upload-icon">
              +
            </span>

            <span>
              <strong>
                {newImage
                  ? 'Chọn ảnh khác'
                  : 'Thay đổi hình ảnh'}
              </strong>

              <small>
                JPG, PNG hoặc ảnh từ thiết bị
              </small>
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

          </label>


          {newImage && (
            <div className="wardrobe-edit-new-image-info">

              <div>
                <span>
                  Ảnh mới đã chọn
                </span>

                <strong>
                  {newImage.name}
                </strong>
              </div>

              <button
                type="button"
                onClick={
                  handleCancelNewImage
                }
              >
                Hủy
              </button>

            </div>
          )}

        </section>


        {/* =====================================
            RIGHT - INFORMATION
            ===================================== */}

        <section className="wardrobe-edit-form-card">

          <div className="wardrobe-edit-card-heading">

            <div className="wardrobe-edit-number">
              02
            </div>

            <div>
              <h2>
                Thông tin trang phục
              </h2>

              <p>
                Điều chỉnh thông tin để
                quản lý và phối đồ chính xác hơn.
              </p>
            </div>

          </div>


          {/* NAME */}

          <div className="wardrobe-edit-field wardrobe-edit-field-full">

            <label htmlFor="name">
              Tên trang phục
              <span>*</span>
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


          <div className="wardrobe-edit-fields-grid">

            {/* CATEGORY */}

            <div className="wardrobe-edit-field">

              <label htmlFor="category">
                Loại trang phục
                <span>*</span>
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORY_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

            </div>


            {/* COLOR */}

            <div className="wardrobe-edit-field">

              <label htmlFor="color">
                Màu sắc
                <span>*</span>
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

                {COLOR_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

            </div>


            {/* SEASON */}

            <div className="wardrobe-edit-field">

              <label htmlFor="season">
                Mùa phù hợp
                <span>*</span>
              </label>

              <select
                id="season"
                name="season"
                value={formData.season}
                onChange={handleChange}
                required
              >
                {SEASON_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

            </div>


            {/* OCCASION */}

            <div className="wardrobe-edit-field">

              <label htmlFor="occasion">
                Hoàn cảnh sử dụng
                <span>*</span>
              </label>

              <select
                id="occasion"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                required
              >
                {OCCASION_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

            </div>

          </div>


          {/* FAVORITE */}

          <label className="wardrobe-edit-favorite">

            <input
              type="checkbox"
              name="is_favorite"
              checked={
                formData.is_favorite
              }
              onChange={handleChange}
            />

            <span className="wardrobe-edit-heart">
              ♥
            </span>

            <span className="wardrobe-edit-favorite-text">

              <strong>
                Trang phục yêu thích
              </strong>

              <small>
                Đánh dấu nếu đây là một
                trong những món đồ bạn
                thường ưu tiên.
              </small>

            </span>

          </label>


          {/* ERROR */}

          {error && (
            <div className="wardrobe-edit-error">
              {error}
            </div>
          )}


          {/* ACTION */}

          <div className="wardrobe-edit-actions">

            <Link
              to={`/wardrobe/${id}`}
              className="wardrobe-edit-cancel"
            >
              Hủy
            </Link>

            <button
              type="submit"
              className="wardrobe-edit-save"
              disabled={saving}
            >
              {saving
                ? 'Đang lưu...'
                : '✓ Lưu thay đổi'}
            </button>

          </div>

        </section>

      </form>

    </div>
  )
}


export default EditWardrobePage