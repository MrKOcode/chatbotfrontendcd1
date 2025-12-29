import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import {jwtDecode} from "jwt-decode";

const REGION = import.meta.env.VITE_COGNITO_REGION;
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;

const pool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
});

// --- helper: groups could be missing ---
const extractGroups = (decoded) => {
  const g = decoded["cognito:groups"];
  if (!g) return [];
  // jwtDecode usually gives an array already, but keep it defensive
  return Array.isArray(g) ? g : [];
};

const roleFromGroups = (groups) => (groups.includes("admins") ? "admin" : "student");


// ---------- helpers ----------
const saveSession = (session) => {
  const idToken = session.getIdToken().getJwtToken();
  const accessToken = session.getAccessToken().getJwtToken();
  const refreshToken = session.getRefreshToken()?.getToken();
  const decoded = jwtDecode(idToken);

  const groups = extractGroups(decoded);
  const role = roleFromGroups(groups);

  localStorage.setItem("idToken", idToken);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken || "");
  localStorage.setItem("username", decoded["cognito:username"]);
  localStorage.setItem("userId", decoded.sub);
  localStorage.setItem("email", decoded.email);

  //New added:
  localStorage.setItem("groups", JSON.stringify(groups));
  localStorage.setItem("role", role);
};

// ---------- register ----------
export const registerUser = async (username, password) =>
  new Promise((resolve, reject) => {
    pool.signUp(username, password, [], null, (err, result) => {
      if (err) return reject({ success: false, error: err.message });
      resolve({
        success: true,
        data: {
          userId: result.userSub,
          username,
        },
      });
    });
  });

// ---------- login ----------
export const loginUser = async (username, password) =>
  new Promise((resolve, reject) => {
    const auth = new AuthenticationDetails({ Username: username, Password: password });
    const user = new CognitoUser({ Username: username, Pool: pool });

    user.authenticateUser(auth, {
      onSuccess: (session) => {
        saveSession(session);
        resolve({
          success: true,
          data: { username },
        });
      },
      onFailure: (err) => reject({ success: false, error: err.message }),
    });
  });

// ---------- check ----------
export const checkAuthStatus = () => {
  const idToken = localStorage.getItem("idToken");
  if (!idToken) return { isAuthenticated: false, user: null };

  const decoded = jwtDecode(idToken);
  const groups = extractGroups(decoded);
  const role = roleFromGroups(groups);

  // keep localStorage consistent in case tokens changed
  localStorage.setItem("groups", JSON.stringify(groups));
  localStorage.setItem("role", role);

  return {
    isAuthenticated: true,
    user: {
      userId: decoded.sub,
      username: decoded["cognito:username"],
      email: decoded.email,
      groups,
      role,
    },
  };
};

// ---------- logout ----------
export const logoutUser = () => {
  localStorage.clear();
};

// OPTIONAL convenience:
export const isAdmin = () => localStorage.getItem("role") === "admin";
