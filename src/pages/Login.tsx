
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900">
      <Navbar />

      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                <LogIn className="h-8 w-8 text-indigo-400" />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-indigo-200">
              Sign in to your account to continue
            </p>
          </div>

          <Card className="border-indigo-500/10 shadow-xl shadow-indigo-900/20 backdrop-blur-lg bg-gray-800/60">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-center text-white">
                Sign In
              </CardTitle>
              <CardDescription className="text-center text-gray-300">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4 bg-red-900/60 border-red-700">
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-4 w-4 text-indigo-300" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10 border-gray-700 bg-gray-700/50 text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-200">Password</Label>
                    <Link
                      to="/login"
                      className="text-sm text-indigo-400 hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-4 w-4 text-indigo-300" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 border-gray-700 bg-gray-700/50 text-white"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full group transition-all hover:shadow-md bg-gradient-to-r from-indigo-600 to-purple-600"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                  <ArrowRight
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                    size={16}
                  />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center flex-col space-y-4">
              <div className="text-sm text-center text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-400 font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
