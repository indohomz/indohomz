/**
 * IndoHomz - Premium Properties Page
 * Light Theme with Professional Design
 */

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Search, 
  MapPin, 
  Building2, 
  Wifi,
  Dumbbell,
  Car,
  ArrowRight,
  Home,
  MessageCircle,
  Grid3X3,
  LayoutList,
  Heart,
  Bed,
  Bath,
  BadgeCheck,
  SlidersHorizontal,
  Phone,
  Wind,
  Star,
  X,
  Filter,
  ChevronDown,
  Navigation
} from 'lucide-react'
import { propertyService, Property } from '../services/api'

// Sample properties for demo
const SAMPLE_PROPERTIES = [
  {
    id: 1, title: "The Luxe Studio", price: "₹22,000", location: "DLF Cybercity, Sector 24",
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    bedrooms: 1, bathrooms: 1, area_sqft: 650, property_type: "studio", is_available: true,
    amenities: "High-Speed WiFi, Fitness Centre, Infinity Pool, Climate Control", slug: "luxe-studio"
  },
  {
    id: 2, title: "Golf View Residence", price: "₹45,000", location: "Golf Course Road, Sector 54",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    bedrooms: 2, bathrooms: 2, area_sqft: 1200, property_type: "apartment", is_available: true,
    amenities: "Smart Home, Private Gym, Valet Parking, 24/7 Concierge, AC", slug: "golf-view"
  },
  {
    id: 3, title: "Urban Co-Living Hub", price: "₹14,000", location: "Sohna Road, Sector 49",
    image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    bedrooms: 1, bathrooms: 1, area_sqft: 400, property_type: "co_living", is_available: true,
    amenities: "Gourmet Meals, Social Events, Co-working Space, AC", slug: "urban-hub"
  },
  {
    id: 4, title: "Skyline Penthouse", price: "₹85,000", location: "MG Road, Sector 28",
    image_url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    bedrooms: 3, bathrooms: 3, area_sqft: 2200, property_type: "penthouse", is_available: true,
    amenities: "Panoramic Views, Private Terrace, Smart Automation, AC", slug: "skyline-penthouse"
  },
  {
    id: 5, title: "Metro Connect Suite", price: "₹18,000", location: "HUDA City Centre, Sector 29",
    image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    bedrooms: 1, bathrooms: 1, area_sqft: 550, property_type: "apartment", is_available: true,
    amenities: "Fibre WiFi, Climate Control, Reserved Parking", slug: "metro-connect"
  },
  {
    id: 6, title: "Premium Studio Loft", price: "₹28,000", location: "Cyber City, Sector 24",
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    bedrooms: 1, bathrooms: 1, area_sqft: 750, property_type: "studio", is_available: false,
    amenities: "Enterprise WiFi, Fitness Studio, Rooftop Lounge, AC", slug: "premium-loft"
  },
  {
    id: 7, title: "Executive Suite", price: "₹35,000", location: "Sector 56, Near Golf Course",
    image_url: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop",
    bedrooms: 2, bathrooms: 2, area_sqft: 1000, property_type: "apartment", is_available: true,
    amenities: "Smart WiFi, Gym Access, Infinity Pool, Personal Concierge, AC", slug: "executive-suite"
  },
  {
    id: 8, title: "Artisan Studio", price: "₹16,000", location: "Sector 47, Near Metro",
    image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    bedrooms: 1, bathrooms: 1, area_sqft: 450, property_type: "studio", is_available: true,
    amenities: "High-Speed WiFi, Climate Control, Power Backup", slug: "artisan-studio"
  }
]

// Property Card Component
const PropertyCard = ({ property, index }: { property: any; index: number }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const amenitiesList = property.amenities?.split(',').map((a: string) => a.trim().toLowerCase()) || []
  const hasWifi = amenitiesList.some((a: string) => a.includes('wifi'))
  const hasGym = amenitiesList.some((a: string) => a.includes('gym'))
  const hasParking = amenitiesList.some((a: string) => a.includes('parking'))
  const hasAC = amenitiesList.some((a: string) => a.includes('ac'))

  // Random rating for demo
  const rating = (4.5 + Math.random() * 0.5).toFixed(1)
  const reviews = Math.floor(50 + Math.random() * 200)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link to={`/property/${property.slug || property.id}`}>
        <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <motion.img 
              src={property.image_url} 
              alt={property.title}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                property.is_available 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {property.is_available ? 'Available Now' : 'Currently Occupied'}
              </span>
            </div>
            
            {/* Like Button */}
            <motion.button 
              onClick={(e) => {
                e.preventDefault()
                setIsLiked(!isLiked)
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-all shadow"
            >
              <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`} />
            </motion.button>
            
            {/* Price & Rating */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <p className="text-xl font-bold text-white text-shadow">{property.price}</p>
                <p className="text-white/80 text-xs">per month</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur shadow text-xs">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-gray-800 font-semibold">{rating}</span>
                <span className="text-gray-500">({reviews})</span>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {property.title}
            </h3>
            
            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <MapPin className="h-4 w-4 text-indigo-500" />
              <span className="text-sm truncate">{property.location}</span>
            </div>
            
            {/* Details */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              {property.bedrooms != null && (
                <span className="text-gray-600 text-sm flex items-center gap-1">
                  <Bed className="h-4 w-4 text-gray-400" /> {property.bedrooms} Bed
                </span>
              )}
              {property.bathrooms != null && (
                <span className="text-gray-600 text-sm flex items-center gap-1">
                  <Bath className="h-4 w-4 text-gray-400" /> {property.bathrooms} Bath
                </span>
              )}
              {property.area_sqft && (
                <span className="text-gray-600 text-sm">{property.area_sqft} sqft</span>
              )}
            </div>
            
            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {hasWifi && (
                <span className="px-2.5 py-1 rounded-full text-xs bg-gray-50 text-gray-600 border border-gray-100 flex items-center gap-1">
                  <Wifi className="h-3 w-3 text-indigo-500" /> WiFi
                </span>
              )}
              {hasAC && (
                <span className="px-2.5 py-1 rounded-full text-xs bg-gray-50 text-gray-600 border border-gray-100 flex items-center gap-1">
                  <Wind className="h-3 w-3 text-indigo-500" /> AC
                </span>
              )}
              {hasGym && (
                <span className="px-2.5 py-1 rounded-full text-xs bg-gray-50 text-gray-600 border border-gray-100 flex items-center gap-1">
                  <Dumbbell className="h-3 w-3 text-indigo-500" /> Gym
                </span>
              )}
              {hasParking && (
                <span className="px-2.5 py-1 rounded-full text-xs bg-gray-50 text-gray-600 border border-gray-100 flex items-center gap-1">
                  <Car className="h-3 w-3 text-indigo-500" /> Parking
                </span>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-center flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-200"
              >
                View Details <ArrowRight className="h-4 w-4" />
              </motion.div>
              <motion.a 
                href={`https://wa.me/919999999999?text=Hi! I'm interested in ${encodeURIComponent(property.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="py-3 px-4 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
              >
                <MessageCircle className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Properties() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'rented'>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch properties from API or use samples
  const { data: apiProperties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyService.getProperties({ limit: 100 }).then(res => res.data),
  })

  // Use API data if available, otherwise use samples
  const properties = apiProperties?.length ? apiProperties : SAMPLE_PROPERTIES

  // Filter properties
  const filteredProperties = useMemo(() => {
    let filtered = [...properties]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.amenities?.toLowerCase().includes(query)
      )
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.property_type === selectedType)
    }
    
    if (availabilityFilter === 'available') {
      filtered = filtered.filter(p => p.is_available)
    } else if (availabilityFilter === 'rented') {
      filtered = filtered.filter(p => !p.is_available)
    }
    
    return filtered
  }, [properties, searchQuery, selectedType, availabilityFilter])

  // Get unique property types
  const propertyTypes = useMemo(() => {
    const types = new Set(properties.map(p => p.property_type).filter(Boolean))
    return Array.from(types) as string[]
  }, [properties])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Subtle Background */}
      <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden sm:block">IndoHomz</span>
            </Link>
            
            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by neighbourhood, amenities, or style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <a 
                href="tel:+919999999999"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all text-sm font-medium"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a 
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors text-sm shadow-lg shadow-green-200"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="sticky top-[73px] z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border flex items-center gap-2 flex-shrink-0 transition-all ${
                showFilters 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Property Type Pills */}
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                selectedType === 'all' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              All Types
            </button>
            {propertyTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap capitalize transition-all flex-shrink-0 ${
                  selectedType === type 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
            
            <div className="h-8 w-px bg-gray-200 flex-shrink-0" />
            
            {/* Availability Filter */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white text-gray-600 border border-gray-200 focus:ring-2 focus:ring-indigo-100 outline-none flex-shrink-0"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
            </select>
            
            {/* Map Link */}
            <a
              href={`https://www.google.com/maps/search/apartments+${encodeURIComponent(searchQuery || 'Gurgaon')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-2 flex-shrink-0 hover:bg-indigo-100 transition-all"
            >
              <Navigation className="h-4 w-4" /> View Map
            </a>
            
            {/* View Toggle */}
            <div className="ml-auto hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl flex-shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500'}`}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Results Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-indigo-600">{filteredProperties.length}</span> Curated Residences
            </h1>
            <p className="text-gray-500 mt-1">Exceptional living spaces across Gurgaon's premier localities</p>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[420px] animate-pulse border border-gray-100" />
            ))}
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && filteredProperties.length > 0 && (
          <motion.div 
            layout
            className={viewMode === 'grid' 
              ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
            }
          >
            <AnimatePresence>
              {filteredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProperties.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Home className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Matching Residences</h3>
            <p className="text-gray-500 mb-8">Refine your search criteria to discover your perfect space</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('')
                setSelectedType('all')
                setAvailabilityFilter('all')
              }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-200"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Floating WhatsApp */}
      <motion.a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-2xl shadow-green-500/30 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>
    </div>
  )
}
