
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Mail, Lock, Info, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Navbar />
      
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          
          <Card className="border-primary/10 shadow-lg shadow-amber-100/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/login" 
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full group" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'} 
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
              </div>
              
              <div className="border border-amber-200 rounded-md p-4 bg-amber-50">
                <div className="flex">
                  <Info className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1 text-amber-800">Demo Accounts</p>
                    <p className="text-muted-foreground mb-2">Use these credentials to test the application:</p>
                    <ul className="space-y-1 text-xs">
                      <li><span className="font-medium">Admin:</span> admin@example.com / password</li>
                      <li><span className="font-medium">User:</span> user@example.com / password</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
