
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
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Protect routes based on authentication and role
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: JSX.Element, 
  requiredRole?: "admin" | "user" 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} />;
  }
  
  return children;
};

// Component with routes wrapped in AuthProvider
const AppRoutes = () => {
  // Set dark theme as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="user">
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/booking" element={
        <ProtectedRoute requiredRole="user">
          <Booking />
        </ProtectedRoute>
      } />
      <Route path="/booking/new" element={
        <ProtectedRoute requiredRole="user">
          <Booking />
        </ProtectedRoute>
      } />
      <Route path="/booking/:id" element={
        <ProtectedRoute requiredRole="user">
          <Booking />
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute requiredRole="user">
          <Billing />
        </ProtectedRoute>
      } />
      <Route path="/billing/:id" element={
        <ProtectedRoute requiredRole="user">
          <Billing />
        </ProtectedRoute>
      } />
      <Route path="/help" element={
        <ProtectedRoute requiredRole="user">
          <Help />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <Admin />
        </ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <Admin />
        </ProtectedRoute>
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
