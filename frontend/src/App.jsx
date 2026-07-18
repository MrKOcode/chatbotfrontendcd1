import "./App.css";
import React from "react";
import LoginScreen from "./components/login_screen/LoginScreen";
import Dashboard from "./components/dashboard/Dashboard";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { checkAuthStatus, logoutUser } from "./services/authService";

function App() {
  // user login state tracker
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const authStatus = checkAuthStatus();
    if (authStatus.isAuthenticated) {
      setIsLoggedIn(true);
      setUserInfo(authStatus.user);
    }
    setIsLoading(false);
  }, []);

  // login handler
  const handleLoginSuccess = () => {
    const authStatus = checkAuthStatus();
    setIsLoggedIn(true);
    setUserInfo(authStatus.user);
  };

  // logout handler
  const handleLogout = () => {
  logoutUser();
  setIsLoggedIn(false);
  setUserInfo(null);
  };

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginScreen onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard userInfo={userInfo} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
