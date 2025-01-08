import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './Styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from './components/Login/Login';
import Tracker from './components/Admin/TrackerPage/Tracker';
import Dashboard from './components/Admin/Dashboard/Dashboard';
import Report from './components/Admin/Reports/Report';
import AddUserForm from './components/Admin/Dashboard/CreateUser/AddUserForm';
import ReporterDashboard from './components/Reporter/ReporterDashboard';
import CarRequest from './components/Reporter/CarRequest/CarRequest';
import ProtectedRoute from './components/ProtectedRoute';
import { auth } from './service/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for user authentication status on app load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading when auth check completes
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // If still loading, show a loader
  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/Reporter/ReporterDashboard" /> : <Login />} />

        {/* Admin routes protected by ProtectedRoute */}
        <Route 
          path="/Admin/Dashboard" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Admin/Dashboard/CreateUser" 
          element={
            <ProtectedRoute user={user}>
              <AddUserForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Admin/Tracker" 
          element={
            <ProtectedRoute user={user}>
              <Tracker />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Admin/Reporter" 
          element={
            <ProtectedRoute user={user}>
              <Report />
            </ProtectedRoute>
          } 
        />
        
        {/* Reporter routes */}
        <Route 
          path="/Reporter/ReporterDashboard"
          element={
            <ProtectedRoute user={user}>
              <ReporterDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Reporter/CarRequest"
          element={
            <ProtectedRoute user={user}>
              <CarRequest />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
