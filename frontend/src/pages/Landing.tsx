/**
 * IndoHomz - Premium Light Theme Landing Page
 * Professional, Clean, Video-First with Google Maps
 */

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Shield, 
  Star, 
  ArrowRight, 
  Building2,
  Sparkles,
  Phone,
  MessageCircle,
  CheckCircle2,
  Zap,
  Heart,
  Play,
  Pause,
  Search,
  Home,
  Wifi,
  Dumbbell,
  Wind,
  Users,
  Clock,
  BadgeCheck,
  ChevronRight,
  Globe,
  Headphones,
  CreditCard,
  Award,
  Navigation,
  Map as MapIcon
} from 'lucide-react'

// 3D Tilt Card Component
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Property data with real-looking info
const PROPERTIES = [
  {
    id: 1,
    title: "The Luxe Studio",
    subtitle: "Cyberhub Premium Living",
    price: "₹22,000",
    location: "DLF Cybercity, Sector 24",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    beds: 1, baths: 1, sqft: 650,
    amenities: ["WiFi", "Gym", "Pool"],
    rating: 4.9, reviews: 128,
    badge: "Most Popular",
    color: "indigo"
  },
  {
    id: 2,
    title: "Golf View Residence",
    subtitle: "Premium 2BHK Apartment",
    price: "₹45,000",
    location: "Golf Course Road, Sector 54",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    beds: 2, baths: 2, sqft: 1200,
    amenities: ["WiFi", "Gym", "Parking", "Concierge"],
    rating: 4.8, reviews: 89,
    badge: "Premium",
    color: "cyan"
  },
  {
    id: 3,
    title: "Urban Co-Living Hub",
    subtitle: "Community Living Space",
    price: "₹14,000",
    location: "Sohna Road, Sector 49",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    beds: 1, baths: 1, sqft: 400,
    amenities: ["WiFi", "Meals", "Events"],
    rating: 4.7, reviews: 256,
    badge: "Best Value",
    color: "emerald"
  },
  {
    id: 4,
    title: "Skyline Penthouse",
    subtitle: "Exclusive Top Floor Living",
    price: "₹85,000",
    location: "MG Road, Sector 28",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    beds: 3, baths: 3, sqft: 2200,
    amenities: ["WiFi", "Gym", "Rooftop", "Smart Home"],
    rating: 5.0, reviews: 42,
    badge: "Luxury",
    color: "amber"
  }
]

const TESTIMONIALS = [
  {
    name: "Aditya Sharma",
    role: "Tech Lead, Microsoft",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    text: "IndoHomz completely changed how I think about renting. Found my dream apartment in 48 hours with zero hassle. The virtual tour feature is a game-changer!",
    rating: 5
  },
  {
    name: "Priya Kapoor",
    role: "Product Designer, Figma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    text: "As someone who relocated from Bangalore, I was skeptical. But the verified listings and 24/7 support made it seamless. Highly recommend for professionals!",
    rating: 5
  },
  {
    name: "Rahul Verma",
    role: "MBA Graduate, ISB",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    text: "The community events at my co-living space are incredible. Made lifelong friends here. IndoHomz understands what young professionals need.",
    rating: 5
  }
]

const STATS = [
  { value: "500+", label: "Happy Residents", icon: Users },
  { value: "50+", label: "Premium Properties", icon: Building2 },
  { value: "4.9", label: "Average Rating", icon: Star },
  { value: "24/7", label: "Support Available", icon: Headphones }
]

const LOCATIONS = [
  { name: "DLF Cybercity", count: 12 },
  { name: "Golf Course Road", count: 8 },
  { name: "MG Road", count: 15 },
  { name: "Sohna Road", count: 10 },
  { name: "HUDA City Centre", count: 7 },
  { name: "Sector 29", count: 9 }
]

// Premium Property Card
const PropertyCard = ({ property, index }: { property: typeof PROPERTIES[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const colorClasses: Record<string, { badge: string; btn: string }> = {
    indigo: { badge: 'bg-indigo-500', btn: 'from-indigo-600 to-indigo-500' },
    cyan: { badge: 'bg-cyan-500', btn: 'from-cyan-600 to-cyan-500' },
    emerald: { badge: 'bg-emerald-500', btn: 'from-emerald-600 to-emerald-500' },
    amber: { badge: 'bg-amber-500', btn: 'from-amber-600 to-amber-500' },
  }
  
  const colors = colorClasses[property.color] || colorClasses.indigo

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <TiltCard>
        <Link 
          to="/properties"
          className="block group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-indigo-100">
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <motion.img 
                src={property.image} 
                alt={property.title}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${colors.badge} text-white shadow-lg`}>
                  {property.badge}
                </span>
              </div>
              
              {/* Like Button */}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-all shadow-lg"
              >
                <Heart className="h-5 w-5 text-gray-600 hover:text-rose-500 transition-colors" />
              </motion.button>
              
              {/* Price */}
              <div className="absolute bottom-4 left-4">
                <p className="text-2xl font-bold text-white text-shadow">{property.price}</p>
                <p className="text-white/80 text-sm">per month</p>
              </div>
              
              {/* Rating */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur shadow">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-gray-800 text-sm font-semibold">{property.rating}</span>
                <span className="text-gray-500 text-xs">({property.reviews})</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wider mb-1">{property.subtitle}</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {property.title}
              </h3>
              
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin className="h-4 w-4 text-indigo-500" />
                <span className="text-sm">{property.location}</span>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                <span className="text-gray-600 text-sm">{property.beds} Bed</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600 text-sm">{property.baths} Bath</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600 text-sm">{property.sqft} sqft</span>
              </div>
              
              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-5">
                {property.amenities.slice(0, 3).map((amenity, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                    {amenity}
                  </span>
                ))}
              </div>
              
              {/* CTA */}
              <motion.div 
                className={`w-full py-3 rounded-xl bg-gradient-to-r ${colors.btn} text-white font-semibold text-center flex items-center justify-center gap-2 shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Property
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </div>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  )
}

// Feature Card
const FeatureCard = ({ icon: Icon, title, description, delay = 0, color = "indigo" }: any) => {
  const colorClasses: Record<string, string> = {
    indigo: 'from-indigo-500 to-indigo-600',
    cyan: 'from-cyan-500 to-cyan-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <div className="relative h-full p-7 rounded-2xl bg-white border border-gray-100 hover:border-indigo-100 transition-all shadow-lg hover:shadow-xl overflow-hidden">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-5 shadow-lg`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
      </div>
    </motion.div>
  )
}

// Testimonial Card
const TestimonialCard = ({ testimonial, index }: { testimonial: typeof TESTIMONIALS[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group"
  >
    <div className="relative p-7 rounded-2xl bg-white border border-gray-100 hover:border-indigo-100 transition-all shadow-lg hover:shadow-xl h-full">
      {/* Quote mark */}
      <div className="absolute top-5 right-5 text-5xl font-serif text-indigo-100">"</div>
      
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      
      <p className="text-gray-600 leading-relaxed mb-6 text-sm">"{testimonial.text}"</p>
      
      <div className="flex items-center gap-4">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
        />
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
        <span className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
          <BadgeCheck className="h-3 w-3" /> Verified
        </span>
      </div>
    </div>
  </motion.div>
)

export default function Landing() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [searchLocation, setSearchLocation] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const toggleVideo = () => {
    if (videoRef.current) {
      isVideoPlaying ? videoRef.current.pause() : videoRef.current.play()
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  // Generate Google Maps URL for search
  const handleLocationSearch = () => {
    if (searchLocation.trim()) {
      const encoded = encodeURIComponent(searchLocation + ', Gurgaon, Haryana, India')
      window.open(`https://www.google.com/maps/search/${encoded}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pattern-dots opacity-40 pointer-events-none" />
      <div className="fixed inset-0 mesh-gradient-light pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200"
              >
                <Building2 className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <span className="text-xl font-bold text-gray-900">IndoHomz</span>
                <span className="hidden sm:block text-[10px] text-gray-400 uppercase tracking-widest">Premium Living</span>
              </div>
            </Link>
            
            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {['Properties', 'Pricing', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>
            
            {/* CTA */}
            <div className="flex items-center gap-3">
              <motion.a 
                href="https://wa.me/919999999999"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all text-sm font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </motion.a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/properties"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Video Background */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop"
          >
            <source src="https://cdn.coverr.co/videos/coverr-a-couple-sitting-on-a-sofa-and-working-on-laptops-6595/1080p.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white" />
        </motion.div>
        
        {/* Video Control */}
        <motion.button
          onClick={toggleVideo}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-8 left-8 z-20 p-3 rounded-full bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all"
        >
          {isVideoPlaying ? <Pause className="h-5 w-5 text-gray-700" /> : <Play className="h-5 w-5 text-gray-700" />}
        </motion.button>
        
        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto"
        >
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-700 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Trusted by 500+ Professionals
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-700 flex items-center gap-2"
            >
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
              #1 in Gurgaon
            </motion.div>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
          >
            <span className="block text-gray-900">Premium Living</span>
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Spaces Reimagined
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Discover curated co-living spaces for modern professionals. 
            <span className="text-gray-900 font-medium"> Zero brokerage. Verified properties. Move in today.</span>
          </motion.p>
          
          {/* Search Box with Google Maps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl" />
              <div className="relative flex items-center gap-2 p-2 rounded-2xl bg-white border border-gray-200 shadow-xl">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <MapPin className="h-5 w-5 text-indigo-500" />
                  <input
                    type="text"
                    placeholder="Search by location (e.g., Cyberhub, Golf Course Road)..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                    className="flex-1 bg-transparent border-0 text-gray-900 placeholder:text-gray-400 focus:outline-none py-3 text-sm sm:text-base"
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLocationSearch}
                  className="px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  <Search className="h-5 w-5" />
                  <span className="hidden sm:inline">Search</span>
                </motion.button>
              </div>
            </div>
            
            {/* Quick Location Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {['Cyberhub', 'Golf Course', 'MG Road', 'Sohna Road'].map((loc) => (
                <motion.button
                  key={loc}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchLocation(loc)}
                  className="px-4 py-2 rounded-full bg-white text-gray-600 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-all border border-gray-200 shadow-sm"
                >
                  {loc}
                </motion.button>
              ))}
              <a
                href="https://www.google.com/maps/search/co-living+spaces+near+Gurgaon"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-all border border-indigo-100 flex items-center gap-1"
              >
                <Navigation className="h-3.5 w-3.5" />
                View Map
              </a>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-indigo-500" />
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Maps Location Section */}
      <section className="relative py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Explore Locations</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gray-900">
              Find Properties <span className="text-indigo-600">Near You</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">Discover premium living spaces across Gurgaon's most sought-after neighborhoods</p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl border border-gray-200"
            >
              <iframe
                src="https://maps.google.com/maps?q=Gurgaon,+Haryana,+India&t=&z=12&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <a
                  href="https://www.google.com/maps/search/premium+apartments+Gurgaon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  <MapIcon className="h-4 w-4 text-indigo-600" />
                  Open in Google Maps
                </a>
              </div>
            </motion.div>
            
            {/* Location List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-indigo-500" />
                Popular Neighborhoods
              </h3>
              <div className="space-y-3">
                {LOCATIONS.map((loc, i) => (
                  <motion.a
                    key={loc.name}
                    href={`https://www.google.com/maps/search/apartments+${encodeURIComponent(loc.name)}+Gurgaon`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                        <MapPin className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="font-medium text-gray-900">{loc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{loc.count} properties</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gray-900">
              Renting, <span className="text-indigo-600">Revolutionized</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">We're not just another rental platform. We're building the future of urban living.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard icon={Shield} title="100% Verified" description="Every property personally inspected and verified by our team. No fake listings, ever." color="indigo" delay={0.1} />
            <FeatureCard icon={Zap} title="Instant Booking" description="Move in within 24 hours. Digital contracts, instant approvals, zero paperwork." color="amber" delay={0.2} />
            <FeatureCard icon={CreditCard} title="Zero Brokerage" description="Save up to ₹50,000 in brokerage fees. Pay only for what matters." color="emerald" delay={0.3} />
            <FeatureCard icon={Award} title="Premium Amenities" description="From high-speed WiFi to gym access, our properties come fully loaded." color="cyan" delay={0.4} />
            <FeatureCard icon={Headphones} title="24/7 Concierge" description="Round-the-clock support for all your needs. We're always here for you." color="rose" delay={0.5} />
            <FeatureCard icon={Globe} title="Neighborhood OS" description="Explore area vibes, nearby gyms, cafes, and metros before you move." color="indigo" delay={0.6} />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="relative py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4"
          >
            <div>
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Featured</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gray-900">
                Handpicked <span className="text-indigo-600">Spaces</span>
              </h2>
            </div>
            <Link 
              to="/properties"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors group"
            >
              View all properties
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROPERTIES.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gray-900">
              Loved by <span className="text-indigo-600">Residents</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center"
            >
              <Home className="h-10 w-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-white">
              Ready to Find Your <span className="text-amber-300">Dream Home?</span>
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-md mx-auto">
              Join 500+ happy residents. Zero brokerage. Move in today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/properties"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-700 font-bold hover:bg-gray-50 transition-all shadow-xl"
                >
                  Browse Properties
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.a 
                href="https://wa.me/919999999999"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur text-white font-bold border border-white/30 hover:bg-white/20 transition-all"
              >
                <MessageCircle className="h-5 w-5 text-green-300" />
                WhatsApp Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-14 px-4 sm:px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">IndoHomz</span>
              </div>
              <p className="text-gray-400 mb-5 max-w-sm">
                Premium co-living spaces for modern professionals. Experience community living at its finest.
              </p>
              <div className="flex gap-3">
                <a href="https://wa.me/919999999999" target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a href="tel:+919999999999" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Phone className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/properties" className="hover:text-white transition-colors">Properties</Link></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +91 99999 99999
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Gurgaon, Haryana
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} IndoHomz. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <motion.a
        href="https://wa.me/919999999999"
        target="_blank"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-2xl shadow-green-500/30 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>
    </div>
  )
}
