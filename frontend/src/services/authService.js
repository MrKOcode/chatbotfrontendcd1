import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { jwtDecode } from "jwt-decode";

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

// ========================
// Token Helpers
// ========================

const saveTokens = (session) => {
  const idToken = session.getIdToken().getJwtToken();
  const accessToken = session.getAccessToken().getJwtToken();
  const refreshToken = session.getRefreshToken().getToken();

  localStorage.setItem("idToken", idToken);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  const decoded = jwtDecode(idToken);

  // username + userId
  const username = decoded.email || decoded["cognito:username"] || "";
  localStorage.setItem("username", username);
  localStorage.setItem("userId", decoded.sub || "");

  // role from Cognito groups: "admins" / "students"
  const groups = decoded["cognito:groups"] || [];
  let role = "user";
  if (Array.isArray(groups)) {
    if (groups.includes("admins")) role = "admin";
    else if (groups.includes("students")) role = "student";
  }
  localStorage.setItem("userRole", role);
};

const clearTokens = () => {
  localStorage.removeItem("idToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
};

// ========================
// Register
// ========================

export const registerUser = (email, password) => {
  return new Promise((resolve) => {
    userPool.signUp(email, password, [], null, (err, result) => {
      if (err) {
        resolve({ success: false, error: err.message });
        return;
      }

      resolve({
        success: true,
        data: {
          username: result.user.getUsername(),
          userConfirmed: result.userConfirmed,
        },
      });
    });
  });
};

// ========================
// Confirm Registration
// ========================

export const confirmRegistration = (email, code) => {
  return new Promise((resolve) => {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        resolve({ success: false, error: err.message });
        return;
      }

      resolve({ success: true });
    });
  });
};

// ========================
// Login
// ========================

export const loginUser = (email, password) => {
  return new Promise((resolve) => {
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        saveTokens(session);
        resolve({ success: true });
      },
      onFailure: (err) => {
        resolve({ success: false, error: err.message });
      },
    });
  });
};

// ========================
// Auth Status
// ========================

export const checkAuthStatus = () => {
  const idToken = localStorage.getItem("idToken");
  if (!idToken) return { isAuthenticated: false };

  try {
    const decoded = jwtDecode(idToken);
    if (Date.now() > decoded.exp * 1000) {
      clearTokens();
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: true,
      user: {
        userId: localStorage.getItem("userId") || decoded.sub,
        username:
          decoded.email ||
          decoded["cognito:username"] ||
          localStorage.getItem("username") || "",
        role: localStorage.getItem("userRole") || "user",
      },
    };
  } catch {
    clearTokens();
    return { isAuthenticated: false };
  }
};

// ========================
// Logout
// ========================

export const logoutUser = () => {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) currentUser.signOut();
  clearTokens();
};