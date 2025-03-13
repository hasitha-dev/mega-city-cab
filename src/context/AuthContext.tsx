import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Redirect admin users to admin page if they're on dashboard or booking
        if (parsedUser.role === "admin") {
          const currentPath = window.location.pathname;
          if (currentPath === "/dashboard" || currentPath === "/booking") {
            navigate("/admin");
          }
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, [navigate]);

  // Mock login function (replace with real API call)
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8070/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }
      const user = await response.json();
      user.email = email;
      user.name = email;
      console.log("User", user);

      localStorage.setItem("accessToken", user.token);
      const dataDecoded: any = jwtDecode(user.token);
      toast.success("Login successful");
      console.log("Data Decoded", dataDecoded);
      if (dataDecoded.isAdmin) {
        console.log("Admin user");
        user.role = "admin";
        setUser(user);
        navigate("/admin"); // Admin users go straight to admin page
      } else {
        console.log("Normal user");
        user.role = "user";
        setUser(user);
        navigate("/dashboard");
      }
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      toast.error(
        "Login failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("You have been logged out");
    navigate("/login");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
