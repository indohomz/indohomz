import React, { useEffect, useState } from 'react'
import ProductsList, { ProductItem } from './ProductsList'
import EmptyState from '../../components/Common/EmptyState'

const STORAGE_KEY = 'ra_products_v1'

const sampleProducts: ProductItem[] = [
  { id: 1, name: 'Wireless Headphones', sku: 'WH-001', stock: 120, price: 99.99 },
  { id: 2, name: 'Smartphone X', sku: 'SP-010', stock: 32, price: 699.0 },
  { id: 3, name: 'Coffee Maker', sku: 'CM-23', stock: 0, price: 49.5 },
]

const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : sampleProducts
    } catch {
      return sampleProducts
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch {}
  }, [products])

  const handleDelete = (id: number) => {
    if (!confirm('Delete this product?')) return
    setProducts(p => p.filter(x => x.id !== id))
  }

  const handleEdit = (item: ProductItem) => {
    const name = prompt('Product name', item.name)
    if (!name) return
    setProducts(p => p.map(x => x.id === item.id ? { ...x, name } : x))
  }

  return (
    <div>
      {products.length === 0 ? (
        <EmptyState 
          title="No products yet" 
          description="Add your first product." 
          icon={() => <span className='text-xl'>📦</span>} 
          action={<button className="btn btn-primary" onClick={() => {
            const nextId = Math.max(0, ...products.map(p => p.id)) + 1
            setProducts(p => [{ id: nextId, name: 'New product', sku: `NP-${nextId}`, stock: 0, price: 0 }, ...p])
          }}>Add Product</button>} 
        />
      ) : (
        <ProductsList products={products} onDelete={handleDelete} onEdit={handleEdit} />
      )}
    </div>
  )
}

export default ProductsManager
