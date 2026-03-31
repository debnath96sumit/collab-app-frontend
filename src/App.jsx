import './App.css'
import Board from './components/Board.jsx'
import Home from './components/Home.jsx'
import { AuthProvider } from './context/AuthProvider.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/auth/PublicRoute.jsx'
import DocumentDashboard from './components/DashboardDocuments.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Toaster from './components/Toaster.jsx'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={<PublicRoute><Home /></PublicRoute>}
          />
          <Route
            path="/login"
            element={<PublicRoute><Login /></PublicRoute>}
          />

          <Route
            path="/register"
            element={<PublicRoute><Register /></PublicRoute>}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DocumentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/board/:id"
            element={
              <ProtectedRoute>
                <Board />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
