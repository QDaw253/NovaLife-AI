import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getClothingItems } from '../../api/wardrobe'


function WardrobePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // =========================================
  // LOAD WARDROBE
  // =========================================

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError('')

        const result = await getClothingItems()

        console.log('Wardrobe items:', result)

        setItems(result.data)
      } catch (err) {
        console.error('Load wardrobe error:', err)

        setError(
          'Không thể tải tủ đồ. Vui lòng thử lại.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])


  // =========================================
  // TRANSLATE
  // =========================================

  const getCategoryLabel = (category) => {
    const categories = {
      top: 'Áo',
      bottom: 'Quần',
      shoes: 'Giày',
      outerwear: 'Áo khoác',
      accessory: 'Phụ kiện',
    }

    return categories[category] || category
  }


  const getColorLabel = (color) => {
    const colors = {
      white: 'Trắng',
      black: 'Đen',
      gray: 'Xám',
      blue: 'Xanh dương',
      green: 'Xanh lá',
      red: 'Đỏ',
      yellow: 'Vàng',
      orange: 'Cam',
      pink: 'Hồng',
      purple: 'Tím',
      brown: 'Nâu',
      beige: 'Be',
    }

    return colors[color] || color || 'Chưa xác định'
  }


  // =========================================
  // SUMMARY
  // =========================================

  const favoriteCount = items.filter(
    (item) => item.is_favorite
  ).length


  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="wardrobe-page-state">

        <div className="wardrobe-page-spinner" />

        <h2>Đang mở tủ đồ...</h2>

        <p>
          NovaLife đang chuẩn bị trang phục của bạn.
        </p>

      </div>
    )
  }


  return (
    <div className="wardrobe-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="wardrobe-header">

        <div className="wardrobe-header-main">

          <p className="wardrobe-eyebrow">
            TỦ ĐỒ CÁ NHÂN
          </p>

          <h1>Tủ đồ của bạn</h1>

          <p className="wardrobe-subtitle">
            Quản lý những trang phục bạn sở hữu và
            xây dựng phong cách phù hợp với chính mình.
          </p>

        </div>


        <div className="wardrobe-header-actions">

          <Link
            to="/wardrobe/new"
            className="wardrobe-create-button"
          >
            + Thêm trang phục
          </Link>

        </div>

      </header>


      {/* =====================================
          SUMMARY
      ====================================== */}

      <section className="wardrobe-summary">

        <div className="wardrobe-summary-item">

          <strong>{items.length}</strong>

          <span>
            trang phục
          </span>

        </div>


        <div className="wardrobe-summary-divider" />


        <div className="wardrobe-summary-item">

          <strong>{favoriteCount}</strong>

          <span>yêu thích</span>

        </div>


        <div className="wardrobe-summary-note">

          <span>◇</span>

          <p>
            Quản lý hình ảnh và thông tin từng món đồ
            để NovaLife hiểu rõ hơn tủ đồ của bạn.
          </p>

        </div>

      </section>


      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="wardrobe-page-error">
          {error}
        </div>
      )}


      {/* =====================================
          CONTENT HEADER
      ====================================== */}

      <div className="wardrobe-content-header">

        <div>
          <p className="wardrobe-section-eyebrow">
            BỘ SƯU TẬP
          </p>

          <h2>Trang phục của tôi</h2>
        </div>


        {items.length > 0 && (
          <span>
            {items.length} món đồ
          </span>
        )}

      </div>


      {/* =====================================
          GRID
      ====================================== */}

      {items.length > 0 ? (

        <div className="wardrobe-grid">

          {items.map((item) => (

            <Link
              key={item.id}
              to={`/wardrobe/${item.id}`}
              className="wardrobe-card"
            >

              {/* IMAGE */}

              <div className="wardrobe-card-image">

                {item.image ? (
                  <img
                    src={item.image}
                    alt={
                      item.name ||
                      'Trang phục NovaLife'
                    }
                  />
                ) : (
                  <div className="wardrobe-image-placeholder">

                    <span>◇</span>

                    <p>Chưa có ảnh</p>

                  </div>
                )}


                <span className="wardrobe-card-category">
                  {getCategoryLabel(item.category)}
                </span>


                {item.is_favorite && (
                  <div
                    className="wardrobe-card-favorite"
                    title="Trang phục yêu thích"
                  >
                    ♥
                  </div>
                )}

              </div>


              {/* INFO */}

              <div className="wardrobe-card-content">

                <div className="wardrobe-card-heading">

                  <h3>
                    {item.name || 'Chưa đặt tên'}
                  </h3>

                  <span>
                    {getColorLabel(item.color)}
                  </span>

                </div>


                <div className="wardrobe-card-footer">

                  <span>
                    Xem chi tiết
                  </span>

                  <strong>→</strong>

                </div>

              </div>

            </Link>

          ))}

        </div>

      ) : (

        /* ===================================
           EMPTY STATE
        ==================================== */

        <div className="wardrobe-empty">

          <div className="wardrobe-empty-visual">

            <div className="wardrobe-empty-hanger">
              ◇
            </div>

          </div>


          <p className="wardrobe-section-eyebrow">
            TỦ ĐỒ ĐANG TRỐNG
          </p>

          <h2>
            Bắt đầu xây dựng tủ đồ của bạn
          </h2>

          <p className="wardrobe-empty-description">
            Thêm những trang phục bạn đang sở hữu.
            NovaLife có thể hỗ trợ phân tích ảnh bằng AI
            khi bạn tạo một món đồ mới.
          </p>


          <Link
            to="/wardrobe/new"
            className="wardrobe-empty-button"
          >
            + Thêm trang phục đầu tiên
          </Link>

        </div>

      )}

    </div>
  )
}


export default WardrobePage