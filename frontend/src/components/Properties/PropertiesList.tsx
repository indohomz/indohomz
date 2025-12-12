import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Grid, List as ListIcon, X } from 'lucide-react'
import PropertyCard from './PropertyCard'
import type { Property } from '../../services/api'

interface Props {
  properties: Property[]
  isLoading?: boolean
  onBookVisit?: (property: Property) => void
  onEdit?: (p: Property) => void
  onDelete?: (id: number) => void
}

const PropertiesList: React.FC<Props> = ({ properties, isLoading, onBookVisit, onEdit, onDelete }) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [propertyType, setPropertyType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = properties

    // Availability filter
    if (filter === 'available') list = list.filter(p => p.is_available)
    if (filter === 'unavailable') list = list.filter(p => !p.is_available)

    // Property type filter
    if (propertyType !== 'all') {
      list = list.filter(p => p.property_type === propertyType)
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.amenities?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      )
    }

    return list
  }, [properties, filter, searchTerm, propertyType])

  // Get unique property types
  const propertyTypes = useMemo(() => {
    const types = new Set(properties.map(p => p.property_type).filter(Boolean))
    return ['all', ...Array.from(types)]
  }, [properties])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl h-[420px] animate-pulse border border-white/10"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-20 py-4 bg-gradient-to-b from-white/80 dark:from-gray-900/80 to-transparent backdrop-blur-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, location, or amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-gray-400"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex gap-3">
            {/* Availability Filter */}
            <div className="flex rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-1">
              {['all', 'available', 'unavailable'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Property Type Dropdown */}
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 capitalize"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type} className="capitalize">
                  {type === 'all' ? 'All Types' : type.replace('_', ' ')}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> of {properties.length} properties
        </p>
        {(searchTerm || filter !== 'all' || propertyType !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('')
              setFilter('all')
              setPropertyType('all')
            }}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Search className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No properties found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
          }
        >
          {filtered.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={index}
              onBookVisit={onBookVisit}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default PropertiesList
