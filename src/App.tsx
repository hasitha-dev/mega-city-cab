
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Booking from "./pages/Booking";
import Billing from "./pages/Billing";
import Help from "./pages/Help";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Signup from "./pages/Signup";
import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const queryClient = new QueryClient();

// ProtectedRoute component to handle role-based access control
const ProtectedRoute = ({ 
  element, 
  requiresAuth = true,
  allowedRoles = [] 
}: { 
  element: JSX.Element, 
  requiresAuth?: boolean,
  allowedRoles?: string[]
}) => {
  const { isAuthenticated, user, refreshToken, loading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkAndRefreshToken = useCallback(async () => {
    if (!isAuthenticated || isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem("accessToken");
      
      if (token) {
        // Check if token is expired or about to expire
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        // If token is expired or about to expire (within 5 minutes)
        if (decoded.exp && decoded.exp - currentTime < 300) {
          await refreshToken();
        }
      }
    } catch (error) {
      console.error("Token refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isAuthenticated, refreshToken, isRefreshing]);

  useEffect(() => {
    checkAndRefreshToken();
    
    // Set up periodic token refresh (every 10 minutes)
    const refreshInterval = setInterval(() => {
      checkAndRefreshToken();
    }, 10 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [checkAndRefreshToken]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle role-based access
  if (isAuthenticated && allowedRoles.length > 0) {
    const userRole = user?.role || "";
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate page based on role
      if (userRole === "admin") {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return element;
};

// AppRoutes component to manage routes after authentication is checked
const AppRoutes = () => {
  const { isAdmin } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* User routes - protected from admin access */}
      <Route path="/dashboard" element={
        <ProtectedRoute 
          element={<Dashboard />} 
          allowedRoles={["user"]} 
        />
      } />
      <Route path="/booking" element={
        <ProtectedRoute 
          element={<Booking />} 
          allowedRoles={["user"]} 
        />
      } />
      <Route path="/booking/new" element={
        <ProtectedRoute 
          element={<Booking />} 
          allowedRoles={["user"]} 
        />
      } />
      <Route path="/billing" element={
        <ProtectedRoute 
          element={<Billing />} 
          allowedRoles={["user"]} 
        />
      } />
      <Route path="/billing/:id" element={
        <ProtectedRoute 
          element={<Billing />} 
          allowedRoles={["user"]} 
        />
      } />
      <Route path="/help" element={
        <ProtectedRoute 
          element={<Help />} 
          allowedRoles={["user"]} 
        />
      } />

      {/* Admin routes - protected from regular user access */}
      <Route path="/admin" element={
        <ProtectedRoute 
          element={<Admin />} 
          allowedRoles={["admin"]} 
        />
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
