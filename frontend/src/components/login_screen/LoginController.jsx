import styles from "./LoginController.module.css";
import React, { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { loginUser } from "../../services/authService";

function LoginController({ username, password, onLoginSuccess, onLoginError }) {
  const [animateButton, setAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      onLoginError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser(username, password);

      if (res.success) {
        onLoginSuccess();
      } else {
        onLoginError(res.error || "Login failed");
      }
    } catch (err) {
      console.error("Cognito login error:", err);
      onLoginError("Unable to login, please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleClick = () => {
    if (isLoading) return;
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
    handleLogin();
  };

  return (
    <button
      className={`${styles.loginButton} ${animateButton ? styles.clicked : ""} ${isLoading ? styles.loading : ""}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? <div className={styles.spinner}></div> : <FaArrowRightLong className={styles.rightArrow} />}
    </button>
  );
}

export default LoginController;
