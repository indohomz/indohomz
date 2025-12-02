import React from 'react'
import { Edit2, Trash2, MapPin, Check } from 'lucide-react'
import type { Property } from '../../services/api'

interface Props {
  property: Property
  onEdit?: (p: Property) => void
  onDelete?: (id: number) => void
}

const PropertyCard: React.FC<Props> = ({ property, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <MapPin size={16} />
            {property.location}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          property.is_available 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {property.is_available ? 'Available' : 'Unavailable'}
        </span>
      </div>

      {/* Price */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-gray-900">₹{property.price}</div>
      </div>

      {/* Amenities */}
      {property.amenities && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Amenities:</span> {property.amenities}
          </p>
        </div>
      )}

      {/* Image */}
      {property.image_url && (
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Property+Image'
          }}
        />
      )}

      {/* Metadata */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-4 pt-4 border-t">
        <span>Added: {new Date(property.created_at).toLocaleDateString()}</span>
        {property.updated_at && (
          <span>Updated: {new Date(property.updated_at).toLocaleDateString()}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(property)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(property.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default PropertyCard
