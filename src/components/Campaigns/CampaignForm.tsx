"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { ArrowLeft, Upload, Plus, X, Calendar, Target, DollarSign, Users, Clock, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockBusinesses, campaignTypes, campaignGoals } from "../../assets/mock.js"
import InfluencerSelection from "./InfluencerSelection"
import CampaignApproval from "./CampaignApproval"

// Enhanced Date Picker Component (keep your existing DatePicker)
const DatePicker = ({ value, onChange, placeholder = "dd/mm/yyyy" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || "")
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const datePickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (value) {
      setInputValue(value)
      try {
        const [day, month, year] = value.split('/')
        if (day && month && year) {
          const date = new Date(year, month - 1, day)
          setSelectedDate(date)
          setCurrentMonth(date)
        }
      } catch (e) {
        // Invalid date format
      }
    }
  }, [value])

  const handleDateSelect = (date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const formatted = `${day}/${month}/${year}`
    
    setInputValue(formatted)
    setSelectedDate(date)
    onChange(formatted)
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    onChange(val)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentMonth(newDate)
  }

  const generateCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    
    return days
  }

  const days = generateCalendar()

  return (
    <div className="relative" ref={datePickerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs cursor-pointer hover:border-gray-400 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-200 transition-all"
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none text-xs placeholder:text-gray-500 focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        />
        <Calendar className="h-4 w-4 text-gray-400" />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <h3 className="text-xs font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
              const isSelected = selectedDate && 
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
              const isToday = new Date().toDateString() === date.toDateString()
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={cn(
                    "text-xs p-2 rounded-lg hover:bg-gray-50 transition-colors",
                    !isCurrentMonth && "text-gray-300",
                    isCurrentMonth && "text-gray-700 hover:bg-gray-100",
                    isSelected && "bg-blue-500 text-white hover:bg-blue-600 font-semibold",
                    isToday && !isSelected && "bg-gray-100 text-gray-800 font-medium"
                  )}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Task Component (keep your existing)
const TaskItem = ({ task, onUpdate, onRemove, canRemove = true }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
      <input
        type="text"
        value={task}
        onChange={(e) => onUpdate(e.target.value)}
        className="flex-1 bg-transparent border-none text-xs focus:outline-none text-gray-900"
        placeholder="Task description"
      />
      {canRemove && (
        <button
          onClick={onRemove}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  )
}

// Professional Dropdown Component (keep your existing)
const ProfessionalDropdown = ({ 
  value, 
  placeholder, 
  options, 
  onSelect, 
  isOpen, 
  onToggle,
  renderOption,
  className = ""
}) => {
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Don't close immediately to allow for option selection
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
              {renderOption ? renderOption(option) : option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Main Campaign Form Component
export default function CampaignForm({ 
  onBack, 
  selectedBusiness = null,
  onCreateCampaign,
  onSaveAsDraft 
}) {
  const [currentStep, setCurrentStep] = useState('form') // 'form', 'influencers', 'approval'
  const [formData, setFormData] = useState({
    name: "",
    createdFor: selectedBusiness?.id || "",
    type: "",
    description: "",
    image: null,
    imagePreview: null,
    budget: "",
    targetAudience: "",
    startDate: "",
    endDate: "",
    goals: "",
    tasks: ["Task 1"]
  })
  const [selectedInfluencersData, setSelectedInfluencersData] = useState(null)

  const [errors, setErrors] = useState({})
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const closeAllDropdowns = () => {
    setOpenDropdown(null)
  }

  const selectedBusinessData = mockBusinesses.find(b => b.id === formData.createdFor)
  const budgetNumber = parseFloat(formData.budget) || 0
  const managementFee = budgetNumber * 0.05
  const availableForInfluencers = budgetNumber - managementFee

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return "Not set"
    
    try {
      const start = new Date(formData.startDate.split('/').reverse().join('-'))
      const end = new Date(formData.endDate.split('/').reverse().join('-'))
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return `${diffDays} days`
    } catch {
      return "Not set"
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, `Task ${prev.tasks.length + 1}`]
    }))
  }

  const updateTask = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }))
  }

  const removeTask = (index) => {
    if (formData.tasks.length > 1) {
      setFormData(prev => ({
        ...prev,
        tasks: prev.tasks.filter((_, i) => i !== index)
      }))
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({ 
          ...prev, 
          image: file,
          imagePreview: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      image: null,
      imagePreview: null
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Campaign name is required"
    if (!formData.createdFor) newErrors.createdFor = "Please select a business"
    if (!formData.type) newErrors.type = "Campaign type is required"
    if (!formData.budget) newErrors.budget = "Budget is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Move to influencer selection
      setCurrentStep('influencers')
    }
  }

  const handleSaveAsDraft = () => {
    onSaveAsDraft?.(formData)
  }

  const handleInfluencerConfirm = (influencerData) => {
    setSelectedInfluencersData(influencerData)
    setCurrentStep('approval')
  }

  const handleFinalApproval = () => {
    const finalCampaignData = {
      ...formData,
      selectedBusiness: selectedBusinessData,
      influencers: selectedInfluencersData
    }
    onCreateCampaign?.(finalCampaignData)
  }

  // Show different views based on current step
  if (currentStep === 'influencers') {
    return (
      <InfluencerSelection
        campaign={{ ...formData, selectedBusiness: selectedBusinessData }}
        onBack={() => setCurrentStep('form')}
        onConfirm={handleInfluencerConfirm}
      />
    )
  }

  if (currentStep === 'approval') {
    return (
      <CampaignApproval
        campaign={{ ...formData, selectedBusiness: selectedBusinessData }}
        selectedInfluencersData={selectedInfluencersData}
        onBack={() => setCurrentStep('influencers')}
        onApprove={handleFinalApproval}
      />
    )
  }

  // Original form view (rest of your existing code)
  return (
    <div className="bg-gray-50 min-h-screen" onClick={closeAllDropdowns}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-900" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Create New Campaign
              </h1>
              <p className="text-xs text-gray-600">
                {selectedBusinessData ? `Creating campaign for ${selectedBusinessData.name}` : "Fill in the campaign details to get started"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">Campaign Details</h2>
                  <p className="text-xs text-gray-600">Fill in the information for your new campaign</p>
                </div>

                <div className="space-y-4">
                  {/* Campaign Name and Created For */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-900">Campaign Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., Summer Collection Launch"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs placeholder:text-gray-500 hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all"
                      />
                      {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-900">Created For</label>
                      <ProfessionalDropdown
                        value={selectedBusinessData ? `${selectedBusinessData.icon} ${selectedBusinessData.name} (${selectedBusinessData.category})` : ""}
                        placeholder="Select business"
                        options={mockBusinesses.filter(b => b.status === 'active')}
                        onSelect={(business) => {
                          handleInputChange('createdFor', business.id)
                          closeAllDropdowns()
                        }}
                        isOpen={openDropdown === 'business'}
                        onToggle={() => handleDropdownToggle('business')}
                        renderOption={(business) => (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{business.icon}</span>
                            <div>
                              <div className="font-medium text-xs">{business.name}</div>
                              <div className="text-xs text-gray-500">{business.category}</div>
                            </div>
                          </div>
                        )}
                      />
                      {errors.createdFor && <p className="text-xs text-red-600">{errors.createdFor}</p>}
                    </div>
                  </div>

                  {/* Campaign Type */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-900">Campaign Type</label>
                    <ProfessionalDropdown
                      value={formData.type}
                      placeholder="Select type"
                      options={campaignTypes}
                      onSelect={(type) => {
                        handleInputChange('type', type)
                        closeAllDropdowns()
                      }}
                      isOpen={openDropdown === 'type'}
                      onToggle={() => handleDropdownToggle('type')}
                    />
                    {errors.type && <p className="text-xs text-red-600">{errors.type}</p>}
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-900">Description</label>
                    <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your campaign objectives and key messages..."
                    rows={3}
                    className="flex w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs placeholder:text-gray-500 hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Campaign Image */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-900">Campaign Image</label>
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img 
                        src={formData.imagePreview} 
                        alt="Campaign preview" 
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </label>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </div>

                {/* Budget and Target Audience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-900">Total Budget ($)</label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="10000"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs placeholder:text-gray-500 hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500">* SG fee (5%) will be deducted from this amount</p>
                    {errors.budget && <p className="text-xs text-red-600">{errors.budget}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-900">Target Audience</label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      placeholder="e.g., Young professionals 25-35"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs placeholder:text-gray-500 hover:border-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Start and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-900">Start Date</label>
                    <DatePicker
                      value={formData.startDate}
                      onChange={(value) => handleInputChange('startDate', value)}
                      placeholder="dd/mm/yyyy"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-900">End Date</label>
                    <DatePicker
                      value={formData.endDate}
                      onChange={(value) => handleInputChange('endDate', value)}
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                </div>

                {/* Campaign Goals */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-900">Campaign Goals</label>
                  <ProfessionalDropdown
                    value={formData.goals}
                    placeholder="Select primary goal"
                    options={campaignGoals}
                    onSelect={(goal) => {
                      handleInputChange('goals', goal)
                      closeAllDropdowns()
                    }}
                    isOpen={openDropdown === 'goals'}
                    onToggle={() => handleDropdownToggle('goals')}
                  />
                </div>

                {/* Campaign Tasks */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-900">Campaign Tasks</label>
                  <div className="space-y-2">
                    {formData.tasks.map((task, index) => (
                      <TaskItem
                        key={index}
                        task={task}
                        onUpdate={(value) => updateTask(index, value)}
                        onRemove={() => removeTask(index)}
                        canRemove={formData.tasks.length > 1}
                      />
                    ))}
                  </div>
                  <button
                    onClick={addTask}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </button>
                </div>
              </div>

              {/* Form Actions - Bottom of Form */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div></div>
                <div className="flex w-full items-center gap-3">
                <button
                    onClick={handleSubmit}
                    style={{ backgroundColor: 'rgb(249, 215, 105)' }}
                    className="px-6 py-2 rounded-md text-xs font-medium text-gray-900 hover:opacity-90 transition-opacity w-full"
                  >
                    Create Campaign
                  </button>
                  <button
                    onClick={handleSaveAsDraft}
                    className="px-4 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors min-w-fit"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-4">
            {/* Selected Business */}
            {selectedBusinessData && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-900 mb-3">Selected Business</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedBusinessData.icon}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900">{selectedBusinessData.name}</h4>
                    <p className="text-xs text-gray-500">{selectedBusinessData.category}</p>
                    <p className="text-xs text-gray-500">{selectedBusinessData.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-xs font-semibold text-gray-900 mb-3">Campaign Summary</h3>
              
              {/* Campaign Image Preview */}
              {formData.imagePreview && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">Campaign Image:</p>
                  <img 
                    src={formData.imagePreview} 
                    alt="Campaign preview" 
                    className="w-full h-32 object-cover rounded-md border border-gray-200"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Target className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Type:</span>
                  <span className="text-gray-900">{formData.type || "Not selected"}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <DollarSign className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Budget:</span>
                  <span className="text-gray-900">${formData.budget || "0"}</span>
                </div>
                
                {budgetNumber > 0 && (
                  <div className="text-xs text-gray-500 ml-5">
                    <div>Available for influencers: ${availableForInfluencers.toLocaleString()}</div>
                    <div>SG Fee (5%): ${managementFee.toLocaleString()}</div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900">{calculateDuration()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Audience:</span>
                  <span className="text-gray-900">{formData.targetAudience || "Not defined"}</span>
                </div>

                {formData.tasks.length > 0 && (
                  <div className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">Tasks ({formData.tasks.length}):</span>
                    </div>
                    <div className="ml-5 text-xs text-gray-600">
                      <div>{formData.tasks[0]}</div>
                      {formData.tasks.length > 1 && <div>+{formData.tasks.length - 1} more tasks</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-xs font-semibold text-gray-900 mb-3">Quick Tips</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div>Choose clear, measurable campaign goals</div>
                <div>Upload a compelling campaign image</div>
                <div>Break down work into specific tasks</div>
                <div>Budget includes 5% SG management fee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}