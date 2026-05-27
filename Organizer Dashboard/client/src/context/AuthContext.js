"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import apiClient from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await apiClient.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        Cookies.remove("authToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      Cookies.set("authToken", response.data.token, { expires: 7 });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullname, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/auth/register", {
        fullname,
        email,
        password,
        role: "organizer",
      });
      Cookies.set("authToken", response.data.token, { expires: 7 });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (_) {
      // ignore cleanup errors
    }
    Cookies.remove("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
