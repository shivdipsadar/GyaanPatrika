import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Login returns user for post-login navigation
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // Save token
      localStorage.setItem("token", token);

      // Set user state
      setUser(user);

      // Return user for immediate use
      return user;
    } catch (err) {
      throw err.response?.data || { message: "Login failed" };
    }
  };

  const signup = async (username, email, password) => {
    try {
      await API.post("/auth/signup", { username, email, password });
    } catch (err) {
      throw err.response?.data || { message: "Signup failed" };
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchProfile();
    else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
