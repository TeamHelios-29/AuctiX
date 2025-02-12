import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import Register from '@/pages/Register';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedUsers={['SELLER']} redirectPath="/login">
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Router>
    </AuthProvider>
  );
};

const Dashboard: React.FC = () => <h2>Dashboard</h2>;

export default App;
