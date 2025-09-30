"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { 
  Bell, 
  Plus, 
  User, 
  LogOut, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { mockNotifications } from '../../assets/mock.js'

const MainLayout = ({ 
  children,
  projects = [],
  selectedProject,
  setSelectedProject,
  companies = [],
  selectedCompany,
  setSelectedCompany,
  activeSection = 'dashboard',
  setActiveSection
}) => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  // Get user data from localStorage
  const user = {
    name: localStorage.getItem('name') || 'User',
    email: localStorage.getItem('email') || 'user@example.com',
    initials: (localStorage.getItem('name') || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Auto-close sidebar on mobile
      if (mobile) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = (isOpen, userInitiated = false) => {
    setSidebarOpen(isOpen)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
      if (!e.target.closest('.notifications-container')) {
        setShowNotifications(false)
      }
      if (!e.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCreateCampaign = () => {
    navigate('/campaignform')
    setActiveSection('campaigns')
    setShowMobileMenu(false)
  }

  const handleNewBusiness = () => {
    navigate('/business')
    setActiveSection('businesses')
    setShowMobileMenu(false)
  }

  const handleLogout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem('name')
    localStorage.removeItem('email')
    localStorage.removeItem('role')
    localStorage.removeItem('isLoggedIn')
    
    // Close the user menu
    setShowUserMenu(false)
    
    // Redirect to login page
    navigate('/login')
  }

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    )
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        userRole="admin"
        projects={projects}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobile={isMobile}
      />
      
      <div className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : (sidebarOpen ? 'ml-64' : 'ml-16')
      }`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
              )}

              {/* Desktop Expand Sidebar Button */}
              {!isMobile && !sidebarOpen && (
                <motion.button
                  onClick={() => toggleSidebar(true, true)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="hidden sm:inline">Expand Sidebar</span>
                </motion.button>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              {/* Desktop Action Buttons */}
              <div className="hidden md:flex items-center gap-3">
                <button 
                  onClick={handleCreateCampaign}
                  className="px-4 py-2 bg-primary text-secondary rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-primary-scale-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Campaign
                </button>
                <button 
                  onClick={handleNewBusiness}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Business
                </button>
              </div>

              {/* Mobile Menu Button */}
              {isMobile && (
                <div className="relative mobile-menu-container">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </button>

                  <AnimatePresence>
                    {showMobileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                      >
                        <button
                          onClick={handleCreateCampaign}
                          className="w-full flex items-center gap-2 px-4 py-3 text-xs text-left hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Create Campaign
                        </button>
                        <button
                          onClick={handleNewBusiness}
                          className="w-full flex items-center gap-2 px-4 py-3 text-xs text-left hover:bg-gray-50 transition-colors border-t border-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                          New Business
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Notifications */}
              <div className="relative notifications-container">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-w-[90vw]"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            onClick={() => markNotificationAsRead(notification.id)}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              notification.unread ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="text-xs font-medium text-gray-900">{notification.title}</h4>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                              </div>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative user-menu-container">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-secondary">{user.initials}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-w-[90vw]"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                            <p className="text-xs text-green-500 mt-1 flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Online
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
        
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="relative">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary-scale-500 transition-colors"
            >
              <Plus className="h-6 w-6 text-secondary" />
            </button>

            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  className="absolute bottom-16 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl"
                >
                  <button
                    onClick={handleCreateCampaign}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs text-left hover:bg-gray-50 transition-colors rounded-t-lg"
                  >
                    <div className="w-8 h-8 bg-primary-scale-100 rounded-full flex items-center justify-center">
                      <Plus className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="font-medium">Create Campaign</span>
                  </button>
                  <button
                    onClick={handleNewBusiness}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs text-left hover:bg-gray-50 transition-colors border-t border-gray-100 rounded-b-lg"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">New Business</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainLayout