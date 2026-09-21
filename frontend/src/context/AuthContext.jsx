// BYPASS LOGIN FOR TESTING - Auto-login with mock user
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export const AuthProvider = ({ children }) => {
  // Auto-login with mock user for testing
  const [user, setUser] = useState({
    _id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default authorization header for API calls
    const mockToken = 'test-mock-token-for-testing';
    localStorage.setItem("token", mockToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${mockToken}`;
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Sending login request:', { email, password }); // Debug log

      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Login response:', response.data); // Debug log

      const { token, user: userData } = response.data;

      if (!token) {
        throw new Error('No token received');
      }

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Debug log
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('Sending register request:', { name, email, password }); // Debug log

      const response = await axios.post("http://localhost:8000/api/auth/register", {
        name,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Register response:', response.data); // Debug log

      // Registration doesn't return token immediately, user needs to verify email
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message); // Debug log
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
