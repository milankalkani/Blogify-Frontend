import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // ✅ Signup
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


  // ✅ Login
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      throw error;
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await axiosInstance.put("/user/update", data);
    localStorage.setItem("user", JSON.stringify(res.data));
    setUser(res.data);
  };

  const getStats = async () => {
    const res = await axiosInstance.get("/users/stats");
    return res.data;
  };

  const uploadAvatar = async (file) => {
    const form = new FormData();
    form.append("image", file);

    const res = await axiosInstance.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, uploadAvatar, getStats, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
