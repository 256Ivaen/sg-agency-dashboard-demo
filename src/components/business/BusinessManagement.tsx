"use client"

import { useState, useCallback, useEffect } from "react"
import { Edit, Trash2, Building2, Plus, X, ChevronLeft, ChevronRight, Check, Eye, Loader2, AlertTriangle, RefreshCw, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import { mockBusinesses } from "../../assets/mock.js"

interface Business {
  id: string
  name: string
  category: string
  description: string
  employee_count: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at?: string
  icon?: string
}

interface BusinessManagementProps {
  businesses: Business[]
  setBusinesses: (businesses: Business[]) => void
  userRole: string
  onCreateBusiness: (data: Omit<Business, 'id' | 'created_at'>) => Promise<{success: boolean, error?: string}>
  onUpdateBusiness: (id: string, data: Partial<Business>) => Promise<{success: boolean, error?: string}>
  onDeleteBusiness: (id: string) => Promise<{success: boolean, error?: string}>
  loading: boolean
  error: string | null
  onRefresh: () => Promise<void>
}

// Business Card Component matching the exact image design
const BusinessCard = ({ business }: { business: Business }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 relative">
    {/* Header with icon and business info */}
    <div className="flex items-start gap-3 mb-3">
      <div className="text-2xl">{business.icon || "🏢"}</div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{business.name}</h3>
        <p className="text-xs text-gray-500">{business.category}</p>
      </div>
    </div>
    
    {/* Description */}
    <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
      {business.description}
    </p>
    
    {/* Bottom section with employee count and status badge */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Users className="h-3 w-3" />
        <span>{business.employee_count}+</span>
      </div>
      
      <Badge 
        className={`text-xs px-2 py-1 rounded-lg font-medium ${
          business.status === 'active' 
            ? 'bg-black text-white' 
            : 'bg-gray-400 text-white'
        }`}
      >
        {business.status}
      </Badge>
    </div>
  </div>
)

// MAIN COMPONENT
export default function BusinessManagement({ 
  businesses = mockBusinesses, 
  setBusinesses, 
  userRole, 
  onCreateBusiness,
  onUpdateBusiness,
  onDeleteBusiness,
  loading = false,
  error = null,
  onRefresh = async () => {}
}: BusinessManagementProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)

  // Use mock data for now
  const displayBusinesses = mockBusinesses

  // Pagination
  const totalPages = Math.ceil(displayBusinesses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBusinesses = displayBusinesses.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Select Business for Campaign
            </h1>
            <p className="text-sm text-gray-600">
              Choose a business to create a new campaign for. Only active businesses are eligible for new campaigns.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50 mb-6">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                {error}
                <button 
                  onClick={onRefresh}
                  disabled={loading}
                  className="ml-4 inline-flex items-center px-2 py-1 text-xs bg-white border border-red-300 rounded hover:bg-red-50"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Retry
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* Businesses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {paginatedBusinesses.map((business) => (
              <BusinessCard 
                key={business.id} 
                business={business}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mb-8">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, displayBusinesses.length)} of {displayBusinesses.length} businesses
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {displayBusinesses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No businesses found</h3>
              <p className="text-sm text-gray-500 mb-4">Contact your administrator to add businesses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Also export as named export for backward compatibility
export { BusinessManagement }