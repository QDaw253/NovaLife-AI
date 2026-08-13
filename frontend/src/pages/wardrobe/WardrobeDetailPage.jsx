import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getClothingItem, deleteClothingItem } from '../../api/wardrobe'

function WardrobeDetailPage() {
  const { id } = useParams()

  const navigate = useNavigate()

  const [item, setItem] = useState(null)

  const handleDelete = async () => {
    const confirmed = window.confirm(
        'Bạn có chắc muốn xóa trang phục này không?'
    )

    if (!confirmed) {
        return
    }

    try {
        await deleteClothingItem(id)

        navigate('/wardrobe')
    } catch (error) {
        console.error('Delete wardrobe error:', error)
        console.error('Status:', error.response?.status)
        console.error('Response:', error.response?.data)

        alert('Không thể xóa trang phục.')
    }
    }

  useEffect(() => {
    const fetchItem = async () => {
      const result = await getClothingItem(id)

      console.log('Wardrobe detail:', result)

      setItem(result.data)
    }

    fetchItem()
  }, [id])

  if (!item) {
    return <p>Đang tải trang phục...</p>
  }

  return (
    <div>
      <Link to="/wardrobe">
        ← Quay lại tủ đồ
      </Link>

      <h1>{item.name || 'Chưa đặt tên'}</h1>

      {item.image && (
        <img
          src={item.image}
          alt={item.name || 'Trang phục'}
          width="250"
        />
      )}

      <p>Danh mục: {item.category}</p>

      <p>Màu sắc: {item.color}</p>

      <p>
        Dịp sử dụng: {item.occasion || 'Không có'}
      </p>

      <p>
        Mùa: {item.season || 'Không có'}
      </p>

      <p>
        Yêu thích: {item.is_favorite ? 'Có' : 'Không'}
      </p>

      <hr />

      <Link to={`/wardrobe/${item.id}/edit`}>
        Chỉnh sửa
      </Link>

      <hr />

      <button
        type="button"
        onClick={handleDelete}>
        Xóa trang phục
        </button>
    </div>
  )
}

export default WardrobeDetailPage