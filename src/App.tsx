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
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const queryClient = new QueryClient();

const App = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");

    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded Token:", decoded);

        setIsAdmin(decoded.isAdmin === true);
      } catch (error) {
        console.error("Invalid token", error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }

    setIsLoading(false);
  }, []);

  console.log("isAdmin:", isAdmin);

  if (isLoading) {
    return <p>Loading...</p>; // Prevent rendering until admin status is determined
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {isAdmin === false ? (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/booking/new" element={<Booking />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/billing/:id" element={<Billing />} />
                  <Route path="/help" element={<Help />} />
                </>
              ) : isAdmin === true ? (
                <Route path="/admin" element={<Admin />} />
              ) : null}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
