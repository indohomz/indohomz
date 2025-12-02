import React, { useMemo, useState } from 'react'
import PropertyCard from './PropertyCard'
import type { Property } from '../../services/api'

interface Props {
  properties: Property[]
  isLoading?: boolean
  onEdit?: (p: Property) => void
  onDelete?: (id: number) => void
}

const PropertiesList: React.FC<Props> = ({ properties, isLoading, onEdit, onDelete }) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    let list = properties

    if (filter === 'available') list = list.filter(p => p.is_available)
    if (filter === 'unavailable') list = list.filter(p => !p.is_available)

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term)
      )
    }

    return list
  }, [properties, filter, searchTerm])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'available', 'unavailable'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-gray-600 text-center pt-4">
        Showing {filtered.length} of {properties.length} properties
      </div>
    </div>
  )
}

export default PropertiesList
