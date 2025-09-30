"use client"

import { useState, useEffect } from "react"
import MainLayout from "@/components/layout/MainLayout"
import { Dashboard } from "../components/dashboard/index"
import type { Business } from "@/types"
import { mockBusinesses } from "@/assets/mock.js"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBusinesses()
  }, [])

  const loadBusinesses = () => {
    setLoading(true)
    setBusinesses(mockBusinesses)
    setLoading(false)
  }

  return (
    <MainLayout
      projects={[]}
      selectedProject={null}
      setSelectedProject={() => {}}
      companies={businesses}
      selectedCompany={selectedCompany}
      setSelectedCompany={setSelectedCompany}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      <Dashboard
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        businesses={businesses}
        setBusinesses={setBusinesses}
        loading={loading}
        onRefresh={loadBusinesses}
      />
    </MainLayout>
  )
}