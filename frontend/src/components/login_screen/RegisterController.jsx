import styles from "./LoginScreen.module.css";
import React from "react";
import {
  registerUser,
  confirmRegistration,
  resendConfirmationCode,
} from "../../services/authService";

function RegisterController({
  username,
  password,
  confirmPassword,
  confirmCode,
  needsConfirmation,
  setNeedsConfirmation,
  onRegistrationComplete,
  onRegisterError,
  onRegisterMessage,
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

    if (res.data.userConfirmed) {
      onRegistrationComplete("Registration complete. You can now log in.");
      return;
    }

    setNeedsConfirmation(true);
    onRegisterMessage("Check your email for the verification code.");
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

    onRegistrationComplete("Email confirmed. You can now log in.");
  };

  const handleResend = async () => {
    const res = await resendConfirmationCode(username);
    if (!res.success) {
      onRegisterError(res.error || "Unable to resend the verification code.");
      return;
    }

    onRegisterMessage("A new verification code has been sent.");
  };

  return (
    <div className={styles.loginButtonContainer}>
      {!needsConfirmation ? (
        <button className={styles.loginButton} onClick={handleRegister}>
          Register
        </button>
      ) : (
        <>
          <button className={styles.loginButton} onClick={handleConfirm}>
            Confirm
          </button>
          <button className={styles.secondaryButton} onClick={handleResend}>
            Resend code
          </button>
        </>
      )}
    </div>
  );
}

export default RegisterController;
