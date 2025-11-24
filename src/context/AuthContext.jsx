import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on page refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  /* ============================================
     SIGN UP
  ============================================ */
  const signup = async ({ name, email, password }) => {
    const res = await axiosInstance.post("/auth/signup", {
      name,
      email,
      password,
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }

    return res.data;
  };

  /* ============================================
     LOGIN
  ============================================ */
  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });

    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    return user;
  };

  /* ============================================
     LOGOUT
  ============================================ */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  /* ============================================
     UPDATE PROFILE  (name, password, avatar)
  ============================================ */
  const updateProfile = async (data) => {
    const formData = new FormData();

    // text fields
    if (data.name) formData.append("name", data.name);
    if (data.password) formData.append("password", data.password);

    // file upload
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }

    const res = await axiosInstance.put("/users/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    const updatedUser = res.data.user;

    // save & refresh UI
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    return updatedUser;
  };

  /* ============================================
     GET USER STATS
  ============================================ */
  const getStats = async () => {
    const res = await axiosInstance.get("/users/stats");
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        getStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
