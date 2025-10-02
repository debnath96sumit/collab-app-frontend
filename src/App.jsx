import './App.css'
import Board from './components/Board.jsx'
import Home from './components/Home.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DocumentDashboard from './components/DashboardDocuments.jsx'
function App() {
  const token = localStorage.getItem("access_token");
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" replace /> : <Home />}
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
    </Router>
  )
}

export default App
