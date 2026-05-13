import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import DonationsPage from './DonationsPage';
import MembersPage from './MembersPage';
import MessagesPage from './MessagesPage';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center',fontSize:'14px',color:'#999'}}>Loading...</div>;
  return user ? children : <Navigate to="/auth" />;
};

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center',fontSize:'14px',color:'#999'}}>Loading...</div>;
  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/donations" element={<PrivateRoute><DonationsPage /></PrivateRoute>} />
      <Route path="/members" element={<PrivateRoute><MembersPage /></PrivateRoute>} />
      <Route path="/messages/:userId" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
