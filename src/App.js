import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Admin/Dashboard" element={<Dashboard />} />
        <Route path="/Admin/Dashboard/CreateUser" element={<AddUserForm />} />
        <Route path="/Admin/Tracker" element={<Tracker />} />
        <Route path="/Admin/Report" element={<Report />} />
        <Route path="/Reporter/Dashboard" element={<ReporterDashboard />} /> {/* Fixed the path */}
        <Route path="/Reporter/CarRequest" element={<CarRequest />} /> {/* Added the Car Request path */}
      </Routes>
    </Router>
  );
}

export default App;
