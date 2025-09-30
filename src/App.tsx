import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import DashboardPage from '@/pages/DashboardPage'
import BusinessPage from '@/pages/BusinessPage'
import CampaignForm from '@/pages/campaignForm'
import GroupsPage from './pages/Groups.jsx'
import Login from '@/pages/Login'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }
  
  return children
}

const PlaceholderPage = ({ title }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚧</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">This page is under development</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/business" 
            element={
              <ProtectedRoute>
                <BusinessPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaignform" 
            element={
              <ProtectedRoute>
                <CampaignForm />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/groups" 
            element={
              <ProtectedRoute>
                <GroupsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all - redirect to login if not authenticated, dashboard if authenticated */}
          <Route 
            path="*" 
            element={
              localStorage.getItem('isLoggedIn') === 'true' 
                ? <Navigate to="/" replace /> 
                : <Navigate to="/login" replace />
            } 
          />
        </Routes>
        
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          duration={4000}
        />
      </div>
    </Router>
  )
}

function App() {
  return <AppContent />
}

export default App