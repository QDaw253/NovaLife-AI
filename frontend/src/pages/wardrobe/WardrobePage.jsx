import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getClothingItems } from '../../api/wardrobe'

function WardrobePage() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchItems = async () => {
      const result = await getClothingItems()

      console.log('Wardrobe items:', result)
      setItems(result.data)
    }

    fetchItems()
  }, [])

  return (
    <div>
      <h1>Tủ đồ</h1>

      <p>Quản lý trang phục của bạn.</p>

      <Link to="/wardrobe/new">
        + Thêm trang phục
      </Link>

      <hr />

      <h2>Trang phục của tôi</h2>

      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.id}>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                width="150"
              />
            )}

            <h3>
              {item.name || 'Chưa đặt tên'}
            </h3>

            <p>Loại: {item.category}</p>

            <p>Màu sắc: {item.color}</p>

            <p>
              Yêu thích: {item.is_favorite ? 'Có' : 'Không'}
            </p>

            <Link to={`/wardrobe/${item.id}`}>
              Xem chi tiết
            </Link>

            <hr />
          </div>
        ))
      ) : (
        <p>Chưa có trang phục nào.</p>
      )}
    </div>
  )
}

export default WardrobePage