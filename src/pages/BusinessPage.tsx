"use client"

import { useState, useEffect, useCallback } from "react"
import MainLayout from "@/components/layout/MainLayout"
import { BusinessManagement } from "@/components/business/BusinessManagement"
import { toast } from "sonner"
import type { Business, Project } from "@/types"
import { mockBusinesses } from "@/assets/mock.js"

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const loadBusinesses = useCallback(() => {
    setBusinesses(mockBusinesses)
  }, [])

  const loadProjects = useCallback(() => {
    setProjects([])
  }, [])

  const loadData = useCallback(() => {
    setLoading(true)
    loadBusinesses()
    loadProjects()
    setLoading(false)
  }, [loadBusinesses, loadProjects])

  const handleRefresh = useCallback(() => {
    loadData()
  }, [loadData])

  const handleCreateBusiness = useCallback(async (businessData: Omit<Business, 'id' | 'created_at'>) => {
    const newBusiness = {
      ...businessData,
      id: `business-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    setBusinesses(prev => [...prev, newBusiness])
    toast.success('Business created successfully')
    return { success: true }
  }, [])

  const handleUpdateBusiness = useCallback(async (id: string, businessData: Partial<Business>) => {
    setBusinesses(prev => prev.map(business => 
      business.id === id ? { ...business, ...businessData } : business
    ))
    toast.success('Business updated successfully')
    return { success: true }
  }, [])

  const handleDeleteBusiness = useCallback(async (id: string) => {
    setBusinesses(prev => prev.filter(business => business.id !== id))
    toast.success('Business deleted successfully')
    return { success: true }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <MainLayout
      projects={projects}
      selectedProject={null}
      setSelectedProject={() => {}}
      companies={businesses}
      selectedCompany="all"
      setSelectedCompany={() => {}}
      activeSection="businesses"
      setActiveSection={() => {}}
    >
      <BusinessManagement
        businesses={businesses}
        setBusinesses={setBusinesses}
        userRole="admin"
        onCreateBusiness={handleCreateBusiness}
        onUpdateBusiness={handleUpdateBusiness}
        onDeleteBusiness={handleDeleteBusiness}
        loading={loading}
        onRefresh={handleRefresh}
      />
    </MainLayout>
  )
}