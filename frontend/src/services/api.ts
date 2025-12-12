/**
 * IndoHomz API Service
 * 
 * Handles all API communication with the IndoHomz backend.
 */

import axios from 'axios'

// Handle different environments
const getApiBaseUrl = () => {
  // Production environment
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || window.location.origin
  }
  // Development environment
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Property {
  id: number
  title: string
  slug?: string
  price: string
  location: string
  area?: string
  city: string
  property_type?: string
  bedrooms?: number
  bathrooms?: number
  area_sqft?: number
  furnishing?: string
  image_url?: string
  images?: string
  amenities?: string
  highlights?: string
  description?: string
  is_available: boolean
  available_from?: string
  created_at: string
  updated_at?: string
}

export interface PropertyCreate {
  title: string
  price: string
  location?: string
  area?: string
  city?: string
  property_type?: string
  bedrooms?: number
  bathrooms?: number
  area_sqft?: number
  furnishing?: string
  image_url?: string
  images?: string
  amenities?: string
  highlights?: string
  description?: string
  is_available?: boolean
  available_from?: string
}

export interface PropertyUpdate extends Partial<PropertyCreate> {}

export interface Lead {
  id: number
  name: string
  email?: string
  phone: string
  property_id?: number
  message?: string
  preferred_visit_date?: string
  status: string
  source: string
  created_at: string
  updated_at?: string
}

export interface LeadCreate {
  name: string
  email?: string
  phone: string
  property_id?: number
  message?: string
  preferred_visit_date?: string
  source?: string
}

export interface Booking {
  id: number
  property_id: number
  lead_id?: number
  tenant_name: string
  tenant_email?: string
  tenant_phone: string
  check_in: string
  check_out?: string
  monthly_rent: number
  security_deposit?: number
  status: string
  created_at: string
  updated_at?: string
}

export interface PropertySearchRequest {
  query?: string
  location?: string
  city?: string
  property_type?: string
  min_price?: number
  max_price?: number
  bedrooms?: number
  amenities?: string[]
  is_available?: boolean
  page?: number
  page_size?: number
}

export interface PropertySearchResponse {
  items: Property[]
  total: number
  page: number
  page_size: number
  query?: string
  filters_applied: Record<string, any>
}

export interface PropertyStats {
  total_properties: number
  available_properties: number
  rented_properties: number
  property_types: Array<{ type: string; count: number }>
  top_locations: Array<{ city: string; count: number }>
}

export interface LeadStats {
  total_leads: number
  new_leads: number
  converted_leads: number
  conversion_rate: number
  by_status: Array<{ status: string; count: number }>
  by_source: Array<{ source: string; count: number }>
}

export interface DashboardAnalytics {
  overview: {
    total_properties: number
    available_properties: number
    rented_properties: number
    total_leads: number
    conversion_rate: number
  }
  recent_activity: {
    new_properties_this_week: number
    new_leads_this_week: number
  }
  property_breakdown: {
    by_type: Array<{ type: string; count: number }>
    by_location: Array<{ city: string; count: number }>
  }
  lead_breakdown: {
    by_status: Array<{ status: string; count: number }>
    by_source: Array<{ source: string; count: number }>
  }
}

// =============================================================================
// PROPERTY SERVICE
// =============================================================================

export const propertyService = {
  // List properties with optional filters
  getProperties: (params?: {
    skip?: number
    limit?: number
    is_available?: boolean
    city?: string
    location?: string
    property_type?: string
    bedrooms?: number
  }) => api.get<Property[]>('/properties', { params }),

  // Get featured properties
  getFeaturedProperties: (limit: number = 6) =>
    api.get<Property[]>('/properties/featured', { params: { limit } }),

  // Get available properties
  getAvailableProperties: (skip: number = 0, limit: number = 12) =>
    api.get<Property[]>('/properties/available', { params: { skip, limit } }),

  // Get single property
  getProperty: (id: number) =>
    api.get<Property>(`/properties/${id}`),

  // Get property by slug
  getPropertyBySlug: (slug: string) =>
    api.get<Property>(`/properties/slug/${slug}`),

  // Search properties
  searchProperties: (searchParams: PropertySearchRequest) =>
    api.post<PropertySearchResponse>('/properties/search', searchParams),

  // Create property
  createProperty: (data: PropertyCreate) =>
    api.post<Property>('/properties', data),

  // Update property
  updateProperty: (id: number, data: PropertyUpdate) =>
    api.put<Property>(`/properties/${id}`, data),

  // Toggle availability
  toggleAvailability: (id: number, is_available: boolean) =>
    api.patch(`/properties/${id}/availability`, null, { params: { is_available } }),

  // Delete property
  deleteProperty: (id: number, permanent: boolean = false) =>
    api.delete(`/properties/${id}`, { params: { permanent } }),

  // Get property stats
  getPropertyStats: () =>
    api.get<PropertyStats>('/properties/stats/overview'),
}

// =============================================================================
// LEAD SERVICE
// =============================================================================

export const leadService = {
  // List leads
  getLeads: (params?: {
    skip?: number
    limit?: number
    status?: string
    source?: string
  }) => api.get<Lead[]>('/leads', { params }),

  // Get leads by property
  getLeadsByProperty: (propertyId: number) =>
    api.get<Lead[]>(`/leads/property/${propertyId}`),

  // Get single lead
  getLead: (id: number) =>
    api.get<Lead>(`/leads/${id}`),

  // Create lead (form submission)
  createLead: (data: LeadCreate) =>
    api.post<Lead>('/leads', data),

  // Quick inquiry submission
  submitInquiry: (data: {
    name: string
    phone: string
    property_id?: number
    email?: string
    message?: string
    source?: string
  }) => api.post('/leads/inquiry', null, { params: data }),

  // Update lead
  updateLead: (id: number, data: Partial<Lead>) =>
    api.put<Lead>(`/leads/${id}`, data),

  // Update lead status
  updateLeadStatus: (id: number, status: string) =>
    api.patch(`/leads/${id}/status`, null, { params: { new_status: status } }),

  // Get lead stats
  getLeadStats: () =>
    api.get<LeadStats>('/leads/stats/overview'),

  // Get lead funnel
  getLeadFunnel: () =>
    api.get('/leads/stats/funnel'),
}

// =============================================================================
// ANALYTICS SERVICE
// =============================================================================

export const analyticsService = {
  // Dashboard analytics
  getDashboardAnalytics: () =>
    api.get<DashboardAnalytics>('/analytics/dashboard'),

  // Property analytics
  getPropertyAnalytics: () =>
    api.get('/analytics/properties/overview'),

  // Lead analytics
  getLeadAnalytics: () =>
    api.get('/analytics/leads/overview'),

  // Price distribution
  getPriceDistribution: () =>
    api.get('/analytics/properties/price-distribution'),

  // Availability trend
  getAvailabilityTrend: (days: number = 30) =>
    api.get('/analytics/properties/availability-trend', { params: { days } }),

  // Conversion funnel
  getConversionFunnel: () =>
    api.get('/analytics/leads/conversion-funnel'),

  // Source performance
  getSourcePerformance: () =>
    api.get('/analytics/leads/source-performance'),

  // Legacy endpoints (for backward compatibility)
  getSalesOverview: () => api.get('/analytics/sales-overview'),
  getInventoryStatus: () => api.get('/analytics/inventory-status'),
  getCustomerInsights: () => api.get('/analytics/customer-insights'),
}

// =============================================================================
// REPORTS SERVICE
// =============================================================================

export const reportService = {
  generateReport: (data: {
    report_type: 'property_overview' | 'availability_status' | 'lead_insights' | 'listing_performance' | 'market_analysis'
    start_date?: string
    end_date?: string
    filters?: any
  }) => api.post('/reports/generate', data),

  getReportTypes: () => api.get('/reports/types'),

  askQuestion: (question: string) =>
    api.post('/reports/ask', null, { params: { question } }),
}

// =============================================================================
// HEALTH SERVICE
// =============================================================================

export const healthService = {
  checkHealth: () => api.get('/'),
  checkDBHealth: () => api.get('/health'),
}

// =============================================================================
// LEGACY ALIASES (for backward compatibility)
// =============================================================================

// These allow existing code to continue working during transition
export const productService = {
  getProducts: propertyService.getProperties,
  getProduct: propertyService.getProperty,
  createProduct: propertyService.createProperty,
  updateProduct: propertyService.updateProperty,
  deleteProduct: propertyService.deleteProperty,
  getLowStockProducts: () => Promise.resolve({ data: [] }),
}

export const customerService = leadService
export const salesService = {
  getSales: () => Promise.resolve({ data: [] }),
  getSale: () => Promise.resolve({ data: null }),
  createSale: () => Promise.resolve({ data: null }),
  getDailySummary: () => Promise.resolve({ data: {} }),
  getWeeklySummary: () => Promise.resolve({ data: {} }),
  getMonthlySummary: () => Promise.resolve({ data: {} }),
}

export default api
