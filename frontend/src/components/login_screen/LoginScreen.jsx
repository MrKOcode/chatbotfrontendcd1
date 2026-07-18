import styles from "./LoginScreen.module.css";
import logo from "../assets/website-icon.png";
import { useState } from "react";
import LoginController from "./LoginController";
import RegisterController from "./RegisterController";
import React from "react";

function LoginScreen({ onLoginSuccess }) {
  // States for input handling
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authMessage, setAuthMessage] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  // error handler
  const handleLoginError = (errorMessage) => {
    setAuthMessage({ type: "error", text: errorMessage });
  };

  const handleRegisterMessage = (message) => {
    setAuthMessage({ type: "success", text: message });
  };

  const handleRegistrationComplete = (message) => {
    setIsRegisterMode(false);
    setPassword("");
    setConfirmPassword("");
    setConfirmCode("");
    setNeedsConfirmation(false);
    handleRegisterMessage(message);
  };

  // success handler
  const handleAuthSuccess = () => {
  // With Cognito Option A:
  // - loginUser() already saved idToken/accessToken/refreshToken in localStorage
  // - confirmRegistration() just confirms email
  // So here we only proceed to app
    onLoginSuccess();
  };

  // 切换模式
  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setAuthMessage(null);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setConfirmCode("");
    setNeedsConfirmation(false);
  };

  return (
    <div className={styles.panelHandler}>
      <div className={styles.loginContainer}>
        {/* This div is for the login inputs */}
        <div className={styles.inputContainer}>
          <h1 className={styles.inputLabel}>
            {isRegisterMode ? "Register" : "Login"}
          </h1>

          {/* Creating the input field for username */}
          <div className={styles.inputGroup}>
            <input
              className={styles.inputField}
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Creating the input field for the password */}
          <div className={styles.inputGroup}>
            <input
              className={styles.inputField}
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm password field for registration */}
          {isRegisterMode && !needsConfirmation && (
            <div className={styles.inputGroup}>
              <input
                className={styles.inputField}
                type="password"
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {isRegisterMode && needsConfirmation && (
          <div className={styles.inputGroup}>
            <input
              className={styles.inputField}
              type="text"
              placeholder="Verification code (from email)"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
            />
          </div>
          )}

          {/* Display error message */}
          <div className={styles.failedLogin}>
            {authMessage && (
              <p className={authMessage.type === "error" ? styles.errorMessage : styles.successMessage}>
                {authMessage.text}
              </p>
            )}
          </div>

          {/* Render appropriate controller based on mode */}
          {isRegisterMode ? (
            <RegisterController
              username={username}
              password={password}
              confirmPassword={confirmPassword}
              confirmCode={confirmCode}
              needsConfirmation={needsConfirmation}
              setNeedsConfirmation={setNeedsConfirmation}
              onRegistrationComplete={handleRegistrationComplete}
              onRegisterError={handleLoginError}
              onRegisterMessage={handleRegisterMessage}
            />
          ) : (
            <LoginController
              username={username}
              password={password}
              onLoginSuccess={handleAuthSuccess}
              onLoginError={handleLoginError}
            />
          )}

          {/* Toggle between login and register */}
          <div className={styles.toggleContainer}>
            <p className={styles.toggleText}>
              {isRegisterMode 
                ? "Already have an account?" 
                : "Don't have an account?"}
              <button 
                className={styles.toggleButton}
                onClick={toggleMode}
              >
                {isRegisterMode ? "Login" : "Register"}
              </button>
            </p>
          </div>
        </div>

        <div className={styles.welcomePanel}>
          <img src={logo} />
          <h1 className={styles.welcomeHeader}>Welcome欢迎！</h1>
          <p className={styles.subtext}>
            {isRegisterMode 
              ? "Create an account to get started!"
              : "Please enter your credentials to log in."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
