/**
 * IndoHomz - Property Detail Page
 * Light Theme with Google Maps Integration
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2,
  MessageCircle,
  Phone,
  Heart,
  Share2,
  CheckCircle2,
  Building2,
  Star,
  Sparkles,
  Home,
  Wifi,
  Wind,
  Dumbbell,
  Car,
  Tv,
  UtensilsCrossed,
  Shield,
  Calendar,
  Clock,
  BadgeCheck,
  Navigation,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'
import { propertyService, leadService } from '../services/api'

// Amenity icons mapping
const amenityIcons: Record<string, any> = {
  'wifi': Wifi,
  'ac': Wind,
  'air conditioning': Wind,
  'gym': Dumbbell,
  'parking': Car,
  'tv': Tv,
  'food': UtensilsCrossed,
  'meals': UtensilsCrossed,
  'security': Shield,
}

const getAmenityIcon = (amenity: string) => {
  const lowerAmenity = amenity.toLowerCase()
  for (const [key, Icon] of Object.entries(amenityIcons)) {
    if (lowerAmenity.includes(key)) return Icon
  }
  return CheckCircle2
}

export default function PropertyDetail() {
  const { slug } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '', visitDate: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      if (slug && isNaN(Number(slug))) {
        return propertyService.getPropertyBySlug(slug).then(res => res.data)
      }
      return propertyService.getProperty(Number(slug)).then(res => res.data)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await leadService.submitInquiry({
        ...formData,
        property_id: property?.id,
        source: 'website',
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Error:', error)
    }
    setIsSubmitting(false)
  }

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        })
      } catch (err) {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate Google Maps URL
  const getGoogleMapsUrl = (location: string) => {
    const encoded = encodeURIComponent(location + ', Gurgaon, Haryana, India')
    return `https://www.google.com/maps/search/?api=1&query=${encoded}`
  }

  // Generate Google Maps Embed URL
  const getGoogleMapsEmbed = (location: string) => {
    const encoded = encodeURIComponent(location + ', Gurgaon, Haryana, India')
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encoded}&zoom=15`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Home className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Property not found</h2>
          <p className="text-gray-500 mb-6">The property you're looking for doesn't exist.</p>
          <Link 
            to="/properties" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to properties
          </Link>
        </div>
      </div>
    )
  }

  const amenitiesList = property.amenities?.split(',').map(a => a.trim()) || []
  const imageUrl = property.image_url || 
    `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop`
  
  // Multiple images for gallery (using variations of the main image)
  const images = [
    imageUrl,
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link 
            to="/properties" 
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Properties</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">IndoHomz</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-1"
              aria-label="Share"
            >
              {copied ? <Check className="h-5 w-5 text-green-600" /> : <Share2 className="h-5 w-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-2">
            {/* Main Image */}
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <img 
                src={images[activeImage]} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 ${
                  property.is_available 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  <BadgeCheck className="h-4 w-4" />
                  {property.is_available ? 'Available Now' : 'Currently Rented'}
                </span>
              </div>
            </div>
            
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-2">
              {images.slice(1, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i + 1)}
                  className={`relative h-[140px] sm:h-[195px] lg:h-[245px] rounded-xl overflow-hidden ${activeImage === i + 1 ? 'ring-2 ring-indigo-600' : ''}`}
                >
                  <img 
                    src={img} 
                    alt={`View ${i + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {property.property_type && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 capitalize">
                    {property.property_type.replace('_', ' ')}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-500" /> 4.8 Rating
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {property.title}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-500 mb-6">
                <MapPin className="h-5 w-5 text-indigo-500" />
                <span>{property.location}</span>
                <a 
                  href={getGoogleMapsUrl(property.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 ml-2"
                >
                  View on Map <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-indigo-600">{property.price}</span>
                <span className="text-gray-400">/month</span>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4"
            >
              {property.bedrooms != null && (
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                  <Bed className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
                  <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                  <p className="text-gray-500 text-sm">Bedrooms</p>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                  <Bath className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
                  <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                  <p className="text-gray-500 text-sm">Bathrooms</p>
                </div>
              )}
              {property.area_sqft && (
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                  <Maximize2 className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
                  <p className="text-2xl font-bold text-gray-900">{property.area_sqft}</p>
                  <p className="text-gray-500 text-sm">Sq. Ft.</p>
                </div>
              )}
            </motion.div>

            {/* Description */}
            {property.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  About this property
                </h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </motion.div>
            )}

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-5">Amenities Included</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenitiesList.map((amenity, i) => {
                    const Icon = getAmenityIcon(amenity)
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Location Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-indigo-500" />
                  Location
                </h2>
                <a 
                  href={getGoogleMapsUrl(property.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
                >
                  Open in Google Maps <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              
              {/* Map Embed Placeholder - In production, use Google Maps API */}
              <div className="relative h-[300px] rounded-xl overflow-hidden bg-gray-100">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location + ', Gurgaon')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                />
              </div>
              
              {/* Nearby Places */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Metro Station', dist: '500m' },
                  { name: 'Shopping Mall', dist: '1.2 km' },
                  { name: 'Hospital', dist: '2 km' },
                  { name: 'Airport', dist: '15 km' },
                ].map((place, i) => (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-700">{place.name}</p>
                    <p className="text-xs text-gray-400">{place.dist}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  Schedule a Visit
                </h3>
                
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h4>
                    <p className="text-gray-500 text-sm">We'll contact you within 30 minutes to confirm your visit.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                    <input
                      type="date"
                      placeholder="Preferred Visit Date"
                      value={formData.visitDate}
                      onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                    <textarea
                      placeholder="Message (optional)"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200"
                    >
                      {isSubmitting ? 'Submitting...' : 'Book Visit Now'}
                    </button>
                  </form>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-gray-400 text-sm text-center mb-4">Or contact us directly</p>
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={`https://wa.me/919999999999?text=Hi! I'm interested in ${encodeURIComponent(property.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 rounded-xl bg-green-500 text-white font-semibold text-center hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                    <a 
                      href="tel:+919999999999"
                      className="py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Phone className="h-4 w-4" />
                      Call Now
                    </a>
                  </div>
                </div>
                
                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> Verified</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 24/7 Support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp - Mobile */}
      <a
        href={`https://wa.me/919999999999?text=Hi! I'm interested in ${encodeURIComponent(property.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform lg:hidden"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  )
}
