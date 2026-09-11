import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteClothingItem, getClothingItem } from '../../api/wardrobe'

const CATEGORY_LABELS = {
  top: 'Áo',
  bottom: 'Quần',
  shoes: 'Giày',
  outerwear: 'Áo khoác',
  accessory: 'Phụ kiện',
}

const COLOR_LABELS = {
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

const SEASON_LABELS = {
  spring: 'Mùa xuân',
  summer: 'Mùa hè',
  autumn: 'Mùa thu',
  winter: 'Mùa đông',
  all_season: 'Mọi mùa',
}

const OCCASION_LABELS = {
  casual: 'Hằng ngày',
  work: 'Đi làm',
  sport: 'Thể thao',
  party: 'Tiệc',
  formal: 'Trang trọng',
  versatile: 'Đa dụng',
}

function WardrobeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await getClothingItem(id)
        setItem(result.data)
      } catch (error) {
        console.error('Load wardrobe detail error:', error)
        setError('Không thể tải thông tin trang phục.')
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  const handleDelete = async () => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa trang phục này khỏi tủ đồ không?')
    if (!confirmed) return

    try {
      setDeleting(true)
      await deleteClothingItem(id)
      navigate('/wardrobe')
    } catch (error) {
      console.error('Delete wardrobe error:', error)
      alert('Không thể xóa trang phục. Vui lòng thử lại.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="wardrobe-detail-page">
        <div className="wardrobe-detail-state">Đang tải trang phục...</div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="wardrobe-detail-page">
        <div className="wardrobe-detail-state">
          <p>{error || 'Không tìm thấy trang phục.'}</p>
          <Link to="/wardrobe" className="wardrobe-detail-back">← Quay lại tủ đồ</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wardrobe-detail-page">
      <Link to="/wardrobe" className="wardrobe-detail-back">← Quay lại tủ đồ</Link>

      <div className="wardrobe-detail-header">
        <div>
          <p className="wardrobe-detail-eyebrow">CHI TIẾT TRANG PHỤC</p>
          <h1>{item.name || 'Chưa đặt tên'}</h1>
          <p className="wardrobe-detail-subtitle">Xem và quản lý thông tin món đồ trong tủ đồ của bạn.</p>
        </div>

        {item.is_favorite && <div className="wardrobe-detail-favorite-badge">♥ Yêu thích</div>}
      </div>

      <div className="wardrobe-detail-card">
        <div className="wardrobe-detail-image-section">
          <div className="wardrobe-detail-section-number">01</div>
          <div className="wardrobe-detail-image-heading">
            <h2>Hình ảnh trang phục</h2>
            <p>Hình ảnh đang được lưu trong tủ đồ NovaLife.</p>
          </div>

          <div className="wardrobe-detail-image-box">
            {item.image ? (
              <img src={item.image} alt={item.name || 'Trang phục'} />
            ) : (
              <div className="wardrobe-detail-no-image">
                <span>◇</span>
                <p>Chưa có hình ảnh</p>
              </div>
            )}
          </div>
        </div>

        <div className="wardrobe-detail-info-section">
          <div className="wardrobe-detail-info-title">
            <div className="wardrobe-detail-section-number">02</div>
            <div>
              <h2>Thông tin trang phục</h2>
              <p>Các đặc điểm được sử dụng để quản lý và phối đồ.</p>
            </div>
          </div>

          <div className="wardrobe-detail-info-list">
            <div className="wardrobe-detail-info-row">
              <span>Loại trang phục</span>
              <strong>{CATEGORY_LABELS[item.category] || item.category}</strong>
            </div>

            <div className="wardrobe-detail-info-row">
              <span>Màu sắc</span>
              <strong>{COLOR_LABELS[item.color] || item.color}</strong>
            </div>

            <div className="wardrobe-detail-info-row">
              <span>Mùa phù hợp</span>
              <strong>{SEASON_LABELS[item.season] || item.season}</strong>
            </div>

            <div className="wardrobe-detail-info-row">
              <span>Hoàn cảnh sử dụng</span>
              <strong>{OCCASION_LABELS[item.occasion] || item.occasion}</strong>
            </div>

            <div className="wardrobe-detail-info-row">
              <span>Trang phục yêu thích</span>
              <strong>{item.is_favorite ? 'Có' : 'Không'}</strong>
            </div>
          </div>

          <div className="wardrobe-detail-actions">
            <Link to={`/wardrobe/${item.id}/edit`} className="wardrobe-detail-edit-button">
              <span>✎</span> Chỉnh sửa
            </Link>

            <button
              type="button"
              className="wardrobe-detail-delete-button"
              onClick={handleDelete}
              disabled={deleting}
            >
              <span>⌫</span> {deleting ? 'Đang xóa...' : 'Xóa khỏi tủ đồ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WardrobeDetailPage