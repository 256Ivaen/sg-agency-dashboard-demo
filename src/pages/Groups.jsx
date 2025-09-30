"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout"
import Groups from "../components/groups/Groups"
import { mockBusinesses } from "../assets/mock.js"

export default function GroupsPage() {
  const navigate = useNavigate()
  const [businesses] = useState(mockBusinesses)
  const [activeSection, setActiveSection] = useState("groups")

  return (
    <MainLayout
      projects={[]}
      selectedProject={null}
      setSelectedProject={() => {}}
      companies={businesses}
      selectedCompany="all"
      setSelectedCompany={() => {}}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      <div className="container mx-auto">
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Groups & Messages</h1>
          <p className="text-sm text-gray-600 mt-1">
            Connect and collaborate with your team in real-time
          </p>
        </div> */}
        
        <Groups />
      </div>
    </MainLayout>
  )
}