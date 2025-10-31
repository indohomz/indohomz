import React from 'react'
import EmptyState from '../components/EmptyState'
import ProductsList from '../components/Products/ProductsList'
import React, { useState } from 'react'

export default function Products() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-primary-700 mb-6">Products</h1>
      <div className="card">
        {/* Toggle to simulate empty state for testing */}
        <ProductsList />
      </div>
    </div>
  )
}
