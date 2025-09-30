"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Search, X, ChevronDown, AlertCircle, MapPin, Users, Eye, ChevronLeft, ChevronRight, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockInfluencers, influencerCategories, influencerCountries } from "../../assets/mock.js"

// SVG Star Component
const StarIcon = ({ filled = true, className = "" }) => {
  return (
    <svg 
      className={className}
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

// Rating Display Component
const RatingDisplay = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon 
          key={star}
          filled={star <= Math.floor(rating)}
          className="text-yellow-400"
        />
      ))}
      <span className="text-xs text-gray-900 ml-1">{rating}</span>
    </div>
  )
}

const ProfessionalDropdown = ({ 
  value, 
  placeholder, 
  options, 
  onSelect, 
  isOpen, 
  onToggle,
  className = ""
}) => {
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Managed by parent
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-40 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelect(option)}
              className="w-full px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const InfluencerCard = ({ 
  influencer, 
  isSelected, 
  onSelect, 
  onDeselect,
  onAmountChange, 
  selectedAmount, 
  isDisabled 
}) => {
  const [showAmountInput, setShowAmountInput] = useState(false)
  const [amount, setAmount] = useState(selectedAmount || "")

  useEffect(() => {
    if (isSelected) {
      setShowAmountInput(true)
      if (selectedAmount) {
        setAmount(selectedAmount)
      }
    } else {
      setShowAmountInput(false)
      setAmount("")
    }
  }, [isSelected, selectedAmount])

  const handleCardClick = () => {
    if (isSelected) {
      // Allow deselection when clicking the card
      return
    }
    
    if (!isDisabled && !isSelected) {
      onSelect(influencer)
      setShowAmountInput(true)
    }
  }

  const handleCheckboxClick = (e) => {
    e.stopPropagation()
    if (isSelected) {
      // Deselect the influencer
      onDeselect(influencer)
      setAmount("")
      setShowAmountInput(false)
    } else if (!isDisabled) {
      // Select the influencer
      onSelect(influencer)
      setShowAmountInput(true)
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    setAmount(value)
    onAmountChange(influencer.id, value)
  }

  // Generate initials for profile placeholder
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "bg-white rounded-lg border p-4 transition-all cursor-pointer relative",
        isSelected && "border-gray-900 shadow-md",
        !isSelected && !isDisabled && "border-gray-200 hover:border-gray-300",
        !isSelected && isDisabled && "border-gray-200 opacity-50 cursor-not-allowed"
      )}
    >
      {/* Checkbox */}
      <div className="absolute top-4 right-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxClick}
          onClick={(e) => e.stopPropagation()}
          disabled={!isSelected && isDisabled}
          className={cn(
            "w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-blue-500",
            isSelected || !isDisabled ? "cursor-pointer" : "cursor-not-allowed"
          )}
        />
      </div>

      {/* Profile Section */}
      <div className="flex items-start gap-3 mb-3 pr-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
          {getInitials(influencer.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{influencer.name}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">{influencer.category}</span>
            <span className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-3 w-3" />
              {influencer.country}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{influencer.description}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-gray-400" />
          <span className="text-gray-900">{influencer.followers}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-gray-400" />
          <span className="text-gray-900">{influencer.engagement}</span>
        </div>
      </div>

      {/* Typical Rate */}
      <p className="text-xs text-gray-600 mb-2">
        Typical rate: ${influencer.typicalRateMin.toLocaleString()} - ${influencer.typicalRateMax.toLocaleString()}
      </p>

      {/* Rating */}
      <div className="mb-3">
        <RatingDisplay rating={influencer.rating} />
      </div>

      {/* Payment Amount Input */}
      {showAmountInput && isSelected && (
        <div className="mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
          <label className="text-xs font-medium text-gray-900 block mb-1">
            Payment Amount ($)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs placeholder:text-gray-500 hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setAmount("")
                onAmountChange(influencer.id, "")
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = []
    
    // Always show first page
    pages.push(1)
    
    // Show pages around current page
    if (currentPage > 2) {
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
    } else {
      // Show pages 2, 3, 4 when on page 1 or 2
      for (let i = 2; i < Math.min(5, totalPages); i++) {
        pages.push(i)
      }
    }
    
    // Show last page if there are more than 1 page
    if (totalPages > 1) {
      if (currentPage < totalPages - 2 && totalPages > 4) pages.push('...')
      if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages)
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-colors",
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-8 h-8 rounded-md text-xs font-medium transition-colors",
              currentPage === page
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-colors",
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function InfluencerSelection({ 
  campaign, 
  onBack, 
  onConfirm 
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("All countries")
  const [selectedCategory, setSelectedCategory] = useState("All categories")
  const [openDropdown, setOpenDropdown] = useState(null)
  const [selectedInfluencers, setSelectedInfluencers] = useState({})
  const [influencerAmounts, setInfluencerAmounts] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  
  const ITEMS_PER_PAGE = 6

  const campaignBudget = parseFloat(campaign?.budget) || 0
  const managementFee = campaignBudget * 0.05
  const availableForInfluencers = campaignBudget - managementFee

  // Calculate totals
  const totalAllocated = Object.values(influencerAmounts).reduce((sum, amount) => {
    return sum + (parseFloat(amount) || 0)
  }, 0)
  const remaining = availableForInfluencers - totalAllocated
  const isBudgetExceeded = totalAllocated > availableForInfluencers
  const isBudgetFull = totalAllocated >= availableForInfluencers

  // Filter influencers
  const filteredInfluencers = mockInfluencers.filter(inf => {
    const matchesSearch = inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inf.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCountry = selectedCountry === "All countries" || inf.country === selectedCountry
    const matchesCategory = selectedCategory === "All categories" || inf.category === selectedCategory
    
    return matchesSearch && matchesCountry && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredInfluencers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentInfluencers = filteredInfluencers.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCountry, selectedCategory])

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const closeAllDropdowns = () => {
    setOpenDropdown(null)
  }

  const handleInfluencerSelect = (influencer) => {
    // Don't allow selection if budget is full and influencer is not already selected
    if (isBudgetFull && !selectedInfluencers[influencer.id]) {
      return
    }

    setSelectedInfluencers(prev => ({
      ...prev,
      [influencer.id]: influencer
    }))
  }

  const handleInfluencerDeselect = (influencer) => {
    setSelectedInfluencers(prev => {
      const newSelected = { ...prev }
      delete newSelected[influencer.id]
      return newSelected
    })
    
    // Also remove the amount
    setInfluencerAmounts(prev => {
      const newAmounts = { ...prev }
      delete newAmounts[influencer.id]
      return newAmounts
    })
  }

  const handleAmountChange = (influencerId, amount) => {
    setInfluencerAmounts(prev => ({
      ...prev,
      [influencerId]: amount
    }))
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCountry("All countries")
    setSelectedCategory("All categories")
  }

  const handleConfirm = () => {
    if (isBudgetExceeded) {
      return
    }
    
    const selectedCount = Object.keys(selectedInfluencers).length
    if (selectedCount === 0) {
      return
    }

    onConfirm({
      influencers: selectedInfluencers,
      amounts: influencerAmounts,
      totalAllocated,
      remaining
    })
  }

  const selectedCount = Object.keys(selectedInfluencers).length

  return (
    <div className="bg-gray-50 min-h-screen" onClick={closeAllDropdowns}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5 text-gray-900" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Select Influencers
              </h1>
              <p className="text-xs text-gray-600">
                Choose influencers for "{campaign?.name}" campaign ({filteredInfluencers.length} available)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {/* Left Column - Filters & Influencers */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search & Filter Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search & Filter
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  {/* Search */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Name or category..."
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 pl-9 pr-3 py-2 text-xs placeholder:text-gray-500 hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Country</label>
                    <ProfessionalDropdown
                      value={selectedCountry}
                      placeholder="All countries"
                      options={influencerCountries}
                      onSelect={(country) => {
                        setSelectedCountry(country)
                        closeAllDropdowns()
                      }}
                      isOpen={openDropdown === 'country'}
                      onToggle={() => handleDropdownToggle('country')}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Category</label>
                    <ProfessionalDropdown
                      value={selectedCategory}
                      placeholder="All categories"
                      options={influencerCategories}
                      onSelect={(category) => {
                        setSelectedCategory(category)
                        closeAllDropdowns()
                      }}
                      isOpen={openDropdown === 'category'}
                      onToggle={() => handleDropdownToggle('category')}
                    />
                  </div>
                </div>

                <button
                  onClick={handleClearFilters}
                  className="text-xs text-gray-600 hover:text-gray-800 underline"
                >
                  Clear Filters
                </button>
              </div>

              {/* Budget Full Warning */}
              {isBudgetFull && !isBudgetExceeded && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    Budget limit reached. Deselect an influencer to select a different one.
                  </p>
                </div>
              )}

              {/* Influencer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentInfluencers.map(influencer => {
                  const isSelected = !!selectedInfluencers[influencer.id]
                  const isDisabled = isBudgetFull && !isSelected
                  
                  return (
                    <InfluencerCard
                      key={influencer.id}
                      influencer={influencer}
                      isSelected={isSelected}
                      onSelect={handleInfluencerSelect}
                      onDeselect={handleInfluencerDeselect}
                      onAmountChange={handleAmountChange}
                      selectedAmount={influencerAmounts[influencer.id]}
                      isDisabled={isDisabled}
                    />
                  )
                })}
              </div>

              {filteredInfluencers.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-sm text-gray-600">No influencers found matching your criteria</p>
                </div>
              )}

              {/* Pagination */}
              {filteredInfluencers.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>

            {/* Right Column - Budget Summary & Selected - FIXED AT 100px */}
            <div className="lg:sticky lg:top-[100px] lg:self-start space-y-4 h-fit">
              {/* Budget Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Budget:</span>
                    <span className="font-semibold text-gray-900">${campaignBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>SG Fee (5%):</span>
                    <span>-${managementFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Available for Influencers:</span>
                    <span className="font-semibold text-gray-900">${availableForInfluencers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allocated:</span>
                    <span className={cn(
                      "font-semibold",
                      isBudgetExceeded ? "text-red-600" : "text-gray-900"
                    )}>
                      ${totalAllocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Remaining:</span>
                    <span className={cn(
                      "font-semibold",
                      remaining < 0 ? "text-red-600" : "text-green-600"
                    )}>
                      ${remaining.toLocaleString()}
                    </span>
                  </div>
                </div>

                {isBudgetExceeded && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">
                      Available budget exceeded
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Influencers */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Selected ({selectedCount})
                </h3>

                {selectedCount === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">
                    No influencers selected
                  </p>
                ) : (
                  <div className="space-y-2">
                    {Object.values(selectedInfluencers).map(inf => (
                      <div key={inf.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <span className="text-xs text-gray-900">{inf.name}</span>
                        <span className="text-xs font-semibold text-gray-900">
                          ${influencerAmounts[inf.id] ? parseFloat(influencerAmounts[inf.id]).toLocaleString() : '0'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={selectedCount === 0 || isBudgetExceeded}
                  className={cn(
                    "w-full mt-4 px-4 py-2 rounded-md text-xs font-medium transition-all",
                    selectedCount === 0 || isBudgetExceeded
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  )}
                >
                  Confirm Selection ({selectedCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}