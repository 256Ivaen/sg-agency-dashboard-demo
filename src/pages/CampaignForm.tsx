"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "@/components/layout/MainLayout"
import CampaignForm from "@/components/campaigns/CampaignForm"
import { toast } from "sonner"
import type { Business } from "@/types"
import { mockBusinesses } from "@/assets/mock.js"

export default function CampaignFormPage() {
  const navigate = useNavigate()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setBusinesses(mockBusinesses)
    setLoading(false)
  }, [])

  const handleCreateCampaign = useCallback(async (campaignData: any) => {
    console.log('Creating campaign:', campaignData)
    toast.success('Campaign created successfully!')
    navigate('/')
    return { success: true }
  }, [navigate])

  const handleSaveAsDraft = useCallback(async (campaignData: any) => {
    console.log('Saving campaign as draft:', campaignData)
    toast.success('Campaign saved as draft!')
    return { success: true }
  }, [])

  const handleBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <MainLayout
      projects={[]}
      selectedProject={null}
      setSelectedProject={() => {}}
      companies={businesses}
      selectedCompany="all"
      setSelectedCompany={() => {}}
      activeSection="campaigns"
      setActiveSection={() => {}}
    >
      <CampaignForm
        onBack={handleBack}
        selectedBusiness={null}
        onCreateCampaign={handleCreateCampaign}
        onSaveAsDraft={handleSaveAsDraft}
      />
    </MainLayout>
  )
}