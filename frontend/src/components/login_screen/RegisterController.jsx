import styles from "./LoginScreen.module.css";
import React from "react";
import { registerUser, confirmRegistration } from "../../services/authService";

function RegisterController({
  username,
  password,
  confirmPassword,
  confirmCode,
  needsConfirmation,
  setNeedsConfirmation,
  onRegisterSuccess,
  onRegisterError,
}) {
  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      onRegisterError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      onRegisterError("Passwords do not match");
      return;
    }

    const res = await registerUser(username, password);
    if (!res.success) {
      onRegisterError(res.error || "Registration failed");
      return;
    }

    setNeedsConfirmation(true);
    onRegisterError("Check your email for the verification code.");
  };

  const handleConfirm = async () => {
    if (!confirmCode) {
      onRegisterError("Enter the verification code from your email.");
      return;
    }

    const res = await confirmRegistration(username, confirmCode);
    if (!res.success) {
      onRegisterError(res.error || "Confirmation failed");
      return;
    }

    onRegisterSuccess({ username });
  };

  return (
    <div className={styles.loginButtonContainer}>
      {!needsConfirmation ? (
        <button className={styles.loginButton} onClick={handleRegister}>
          Register
        </button>
      ) : (
        <button className={styles.loginButton} onClick={handleConfirm}>
          Confirm
        </button>
      )}
    </div>
  );
}

export default RegisterController;