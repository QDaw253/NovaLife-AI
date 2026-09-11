import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recommendOutfit } from '../../api/wardrobe'

const OCCASION_OPTIONS = [
  { value: 'casual', label: 'Hằng ngày', description: 'Thoải mái và dễ mặc' },
  { value: 'work', label: 'Đi làm', description: 'Gọn gàng và chuyên nghiệp' },
  { value: 'sport', label: 'Thể thao', description: 'Năng động và tiện lợi' },
  { value: 'party', label: 'Đi tiệc', description: 'Nổi bật và có điểm nhấn' },
  { value: 'formal', label: 'Trang trọng', description: 'Chỉn chu và lịch sự' },
  { value: 'versatile', label: 'Đa dụng', description: 'Linh hoạt cho nhiều hoàn cảnh' },
]

const SEASON_OPTIONS = [
  { value: 'spring', label: 'Mùa xuân' },
  { value: 'summer', label: 'Mùa hè' },
  { value: 'autumn', label: 'Mùa thu' },
  { value: 'winter', label: 'Mùa đông' },
  { value: 'all_season', label: 'Mọi mùa' },
]

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

function getImageUrl(image) {
  if (!image) return null
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  return `http://127.0.0.1:8000${image}`
}

function OutfitRecommendationPage() {
  const [formData, setFormData] = useState({ occasion: 'casual', season: 'summer' })
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleOccasionChange = (occasion) => {
    setFormData((previous) => ({ ...previous, occasion }))
  }

  const handleSeasonChange = (e) => {
    setFormData((previous) => ({ ...previous, season: e.target.value }))
  }

  const handleRecommend = async (e) => {
    e?.preventDefault()
    try {
      setLoading(true)
      setMessage('')
      setRecommendation(null)

      const result = await recommendOutfit(formData)
      const data = result.data

      if (data.status === 'cannot_recommend') {
        setMessage('Tủ đồ hiện tại chưa đủ trang phục phù hợp để tạo outfit cho lựa chọn này.')
        return
      }

      setRecommendation(data)
    } catch (error) {
      console.error('Recommend outfit error:', error)
      const apiMessage = error.response?.data?.errors?.ai?.[0]
      setMessage(apiMessage || 'Không thể tạo gợi ý phối đồ. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="outfit-page">
      <div className="outfit-header">
        <div>
          <p className="outfit-eyebrow">NOVALIFE AI STYLIST</p>
          <h1>Gợi ý phối đồ</h1>
          <p className="outfit-subtitle">
            Chọn hoàn cảnh và mùa. NovaLife AI sẽ tìm những món đồ phù hợp ngay trong tủ đồ của bạn.
          </p>
        </div>

        <div className="outfit-ai-badge">
          <span>✦</span>
          <div>
            <strong>AI Stylist</strong>
            <small>Phối từ tủ đồ của bạn</small>
          </div>
        </div>
      </div>

      <form className="outfit-config-card" onSubmit={handleRecommend}>
        <div className="outfit-config-section">
          <div className="outfit-section-heading">
            <div className="outfit-section-number">01</div>
            <div>
              <h2>Bạn sẽ mặc outfit này ở đâu?</h2>
              <p>Chọn hoàn cảnh để AI xác định phong cách phù hợp.</p>
            </div>
          </div>

          <div className="outfit-occasion-grid">
            {OCCASION_OPTIONS.map((option) => {
              const active = formData.occasion === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`outfit-occasion-option ${active ? 'active' : ''}`}
                  onClick={() => handleOccasionChange(option.value)}
                >
                  <span className="outfit-option-check">{active ? '✓' : ''}</span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </button>
              )
            })}
          </div>
        </div>

        <div className="outfit-config-section outfit-season-section">
          <div className="outfit-section-heading">
            <div className="outfit-section-number">02</div>
            <div>
              <h2>Mùa phù hợp</h2>
              <p>AI sẽ ưu tiên các món đồ phù hợp với mùa bạn lựa chọn.</p>
            </div>
          </div>

          <div className="outfit-season-row">
            <div className="outfit-season-select">
              <label htmlFor="outfit-season">Chọn mùa</label>
              <select id="outfit-season" value={formData.season} onChange={handleSeasonChange}>
                {SEASON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="outfit-generate-button" disabled={loading}>
              <span>{loading ? '◌' : '✦'}</span>
              {loading ? 'AI đang phối đồ...' : 'Tạo outfit với AI'}
            </button>
          </div>
        </div>
      </form>

      {message && (
        <div className="outfit-message">
          <span>!</span>
          <div>
            <strong>Chưa thể tạo outfit</strong>
            <p>{message}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="outfit-loading-card">
          <div className="outfit-loading-icon">✦</div>
          <h3>NovaLife AI đang phối đồ</h3>
          <p>AI đang xem các món đồ trong tủ và tìm sự kết hợp phù hợp nhất.</p>
          <div className="outfit-loading-bar"><span /></div>
        </div>
      )}

      {recommendation && !loading && (
        <section className="outfit-result">
          <div className="outfit-result-heading">
            <div>
              <p className="outfit-eyebrow">OUTFIT ĐƯỢC ĐỀ XUẤT</p>
              <h2>Outfit dành cho bạn</h2>
              <p>Các món đồ dưới đây đều được chọn trực tiếp từ tủ đồ NovaLife.</p>
            </div>

            <button type="button" className="outfit-regenerate-button" onClick={handleRecommend}>
              ↻ Gợi ý lại
            </button>
          </div>

          <div className="outfit-items-grid">
            {recommendation.items?.map((item, index) => {
              const imageUrl = getImageUrl(item.image)
              return (
                <article key={item.id} className="outfit-item-card">
                  <div className="outfit-item-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="outfit-item-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.name || 'Trang phục'} />
                    ) : (
                      <div className="outfit-item-no-image">◇</div>
                    )}
                  </div>

                  <div className="outfit-item-content">
                    <div className="outfit-item-tags">
                      <span>{CATEGORY_LABELS[item.category] || item.category}</span>
                      <span>{COLOR_LABELS[item.color] || item.color}</span>
                    </div>

                    <h3>{item.name || 'Chưa đặt tên'}</h3>

                    <Link to={`/wardrobe/${item.id}`} className="outfit-item-link">
                      Xem trang phục<span>→</span>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="outfit-explanation">
            <div className="outfit-explanation-icon">✦</div>
            <div>
              <p className="outfit-explanation-label">NOVALIFE AI</p>
              <h3>Vì sao outfit này phù hợp?</h3>
              <p className="outfit-explanation-text">{recommendation.explanation}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default OutfitRecommendationPage