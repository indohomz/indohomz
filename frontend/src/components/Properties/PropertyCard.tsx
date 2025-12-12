import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Maximize2, Wifi, Car, Dumbbell, Heart } from 'lucide-react'
import type { Property } from '../../services/api'

interface Props {
  property: Property
  onBookVisit?: (property: Property) => void
  onFavorite?: (property: Property) => void
  index?: number
}

const PropertyCard: React.FC<Props> = ({ property, onBookVisit, onFavorite, index = 0 }) => {
  // Parse amenities string to array
  const amenitiesList = property.amenities?.split(',').map(a => a.trim().toLowerCase()) || []
  
  // Check for specific amenities
  const hasWifi = amenitiesList.some(a => a.includes('wifi') || a.includes('wi-fi'))
  const hasParking = amenitiesList.some(a => a.includes('parking') || a.includes('garage'))
  const hasGym = amenitiesList.some(a => a.includes('gym') || a.includes('fitness'))
  
  // Default image fallback
  const imageUrl = property.image_url || 
    `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Glassmorphism Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
        
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              property.is_available 
                ? 'bg-emerald-500/80 text-white' 
                : 'bg-red-500/80 text-white'
            }`}>
              {property.is_available ? 'Available' : 'Rented'}
            </span>
          </div>
          
          {/* Favorite Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onFavorite?.(property)
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
          >
            <Heart className="h-5 w-5 text-white hover:text-red-400 transition-colors" />
          </button>
          
          {/* Price Tag */}
          <div className="absolute bottom-4 left-4">
            <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30">
              <span className="text-2xl font-bold text-white">{property.price}</span>
            </div>
          </div>
          
          {/* Property Type Badge */}
          {property.property_type && (
            <div className="absolute bottom-4 right-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/80 text-white backdrop-blur-md capitalize">
                {property.property_type.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {property.title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
            <MapPin className="h-4 w-4 text-indigo-500" />
            <span className="text-sm truncate">{property.location}</span>
          </div>
          
          {/* Property Details */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
            {property.bedrooms !== null && property.bedrooms !== undefined && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                </span>
              </div>
            )}
            {property.bathrooms !== null && property.bathrooms !== undefined && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {property.bathrooms} Bath
                </span>
              </div>
            )}
            {property.area_sqft && (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {property.area_sqft} sqft
                </span>
              </div>
            )}
          </div>
          
          {/* Amenities Icons */}
          <div className="flex items-center gap-3 mb-4">
            {hasWifi && (
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30" title="WiFi">
                <Wifi className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            )}
            {hasParking && (
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30" title="Parking">
                <Car className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            )}
            {hasGym && (
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30" title="Gym">
                <Dumbbell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            )}
            {amenitiesList.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{amenitiesList.length - 3} more
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onBookVisit?.(property)}
              disabled={!property.is_available}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                property.is_available
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {property.is_available ? 'Book Visit' : 'Not Available'}
            </button>
            <button className="py-3 px-4 rounded-xl font-semibold text-sm border-2 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
              Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyCard
