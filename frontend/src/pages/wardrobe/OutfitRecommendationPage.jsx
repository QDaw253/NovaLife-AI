import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recommendOutfit } from '../../api/wardrobe'


function getImageUrl(image) {
  if (!image) {
    return null
  }

  // Nếu backend đã trả full URL thì dùng luôn
  if (
    image.startsWith('http://') ||
    image.startsWith('https://')
  ) {
    return image
  }

  // Nếu backend trả dạng:
  // /media/wardrobe/ao.webp
  // thì nối thêm host Django
  return `http://127.0.0.1:8000${image}`
}


function translateCategory(category) {
  const categories = {
    top: 'Áo',
    bottom: 'Quần',
    shoes: 'Giày',
    outerwear: 'Áo khoác',
    accessory: 'Phụ kiện',
  }

  return categories[category] || category
}


function translateColor(color) {
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

  return colors[color] || color
}


function OutfitRecommendationPage() {
  const [formData, setFormData] = useState({
    occasion: 'casual',
    season: 'summer',
  })

  const [recommendation, setRecommendation] =
    useState(null)

  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState('')


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  const handleRecommend = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setMessage('')
      setRecommendation(null)

      const result = await recommendOutfit(formData)

      console.log(
        'Outfit recommendation:',
        result
      )

      const data = result.data

      if (data.status === 'cannot_recommend') {
        setMessage(
          'Tủ đồ hiện tại chưa đủ trang phục phù hợp để tạo outfit.'
        )

        return
      }

      setRecommendation(data)

    } catch (error) {
      console.error(
        'Recommend outfit error:',
        error
      )

      console.error(
        'Status:',
        error.response?.status
      )

      console.error(
        'Response:',
        error.response?.data
      )

      setMessage(
        'Không thể tạo gợi ý phối đồ. Vui lòng thử lại.'
      )

    } finally {
      setLoading(false)
    }
  }


  return (
    <div>
      <h1>Gợi ý phối đồ AI</h1>

      <p>
        Chọn hoàn cảnh và mùa để NovaLife gợi ý
        trang phục từ tủ đồ của bạn.
      </p>


      {/* FORM GỢI Ý */}

      <form onSubmit={handleRecommend}>

        <div>
          <label>
            Dịp sử dụng
          </label>

          <br />

          <select
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
          >
            <option value="casual">
              Hằng ngày
            </option>

            <option value="work">
              Đi làm
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

            <option value="versatile">
              Đa dụng
            </option>
          </select>
        </div>


        <br />


        <div>
          <label>
            Mùa
          </label>

          <br />

          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
          >
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

            <option value="all_season">
              Quanh năm
            </option>
          </select>
        </div>


        <br />


        <button
          type="submit"
          disabled={loading}
        >
          {
            loading
              ? 'AI đang phối đồ...'
              : '✨ Gợi ý outfit bằng AI'
          }
        </button>

      </form>


      {/* MESSAGE */}

      {
        message && (
          <>
            <br />

            <p>
              {message}
            </p>
          </>
        )
      }


      {/* KẾT QUẢ AI */}

      {
        recommendation && (
          <>
            <hr />

            <h2>
              Outfit AI đề xuất
            </h2>


            {/* DANH SÁCH TRANG PHỤC */}

            {
              recommendation.items?.map(
                (item) => {

                  const imageUrl =
                    getImageUrl(item.image)

                  return (
                    <div key={item.id}>

                      {
                        imageUrl && (
                          <>
                            <img
                              src={imageUrl}
                              alt={item.name}
                              width="200"
                            />

                            <br />
                          </>
                        )
                      }


                      <h3>
                        {item.name}
                      </h3>


                      <p>
                        Danh mục:{' '}
                        {
                          translateCategory(
                            item.category
                          )
                        }
                      </p>


                      <p>
                        Màu sắc:{' '}
                        {
                          translateColor(
                            item.color
                          )
                        }
                      </p>


                      <Link
                        to={`/wardrobe/${item.id}`}
                      >
                        Xem trang phục
                      </Link>


                      <hr />
                    </div>
                  )
                }
              )
            }


            {/* EXPLANATION */}

            <h3>
              💡 Lý do AI đề xuất
            </h3>

            <p>
              {recommendation.explanation}
            </p>

          </>
        )
      }

    </div>
  )
}


export default OutfitRecommendationPage