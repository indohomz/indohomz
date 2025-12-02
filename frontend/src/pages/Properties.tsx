import React, { useEffect, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import PropertiesList from '../components/Properties/PropertiesList'
import { propertyService, type Property } from '../services/api'

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await propertyService.getProperties({ limit: 100 })
      setProperties(response.data)
    } catch (err) {
      setError('Failed to load properties')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyService.deleteProperty(id)
        setProperties(properties.filter(p => p.id !== id))
      } catch (err) {
        setError('Failed to delete property')
        console.error(err)
      }
    }
  }

  const handleEdit = (property: Property) => {
    // TODO: Implement edit functionality
    console.log('Edit property:', property)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Add Property
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Properties</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{properties.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Available</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {properties.filter(p => p.is_available).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Unavailable</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {properties.filter(p => !p.is_available).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={loadProperties}
            className="ml-4 underline font-medium hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Properties List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
        </div>
      ) : (
        <PropertiesList
          properties={properties}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default Properties
