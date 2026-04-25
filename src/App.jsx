import './App.css'
// import Board from './components/Board.jsx'
import Home from './pages/Home.jsx'
import { AuthProvider } from './context/AuthProvider.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/auth/PublicRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Toaster from './components/Toaster.jsx'
import Editor from './pages/Editor.jsx'
import NotFound from './pages/NotFound.jsx'
import InvitationAccept from './pages/invitation/accept.jsx'

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
            path="/invitation/accept"
            element={<InvitationAccept />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/board/:id"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
