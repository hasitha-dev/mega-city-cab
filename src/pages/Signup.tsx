import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, redirect, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { User, Mail, Lock, Home, Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Required"),
    address: Yup.string().required("Required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Must be a valid 10-digit phone number")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      address: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form Data:", values);
      const res = await fetch("http://localhost:8080/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const user = await res.json();
        console.log("User created:", user);
        toast.success("User created successfully");
        formik.resetForm();
        navigate("/login");
      } else {
        const error = await res.json();
        console.error("Failed to create user:", error);
        toast.error("Failed to create user: " + error.message);
        formik.resetForm();
      }
    },
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100">
        <title>Sign Up | My App</title>
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <User className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-foreground">
                Create an Account
              </h2>
              <p className="mt-2 text-muted-foreground">
                Sign up to get started
              </p>
            </div>

            <Card className="border-primary/10 shadow-lg shadow-purple-100/50 backdrop-blur-sm bg-white/90">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center">
                  Sign Up
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your details to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Your username"
                        className="pl-10 border border-purple-200"
                        {...formik.getFieldProps("username")}
                      />
                    </div>
                    {formik.touched.username && formik.errors.username && (
                      <p className="text-sm text-red-500">
                        {formik.errors.username}
                      </p>
                    )}
                  </div>

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
                        className="pl-10 border border-purple-200"
                        {...formik.getFieldProps("email")}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-sm text-red-500">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 border border-purple-200"
                        {...formik.getFieldProps("password")}
                      />
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-sm text-red-500">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Home className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="address"
                        type="text"
                        placeholder="Your address"
                        className="pl-10 border border-purple-200"
                        {...formik.getFieldProps("address")}
                      />
                    </div>
                    {formik.touched.address && formik.errors.address && (
                      <p className="text-sm text-red-500">
                        {formik.errors.address}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="1234567890"
                        className="pl-10 border border-purple-200"
                        {...formik.getFieldProps("phone")}
                      />
                    </div>
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-sm text-red-500">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full group transition-all hover:shadow-md bg-gradient-to-r from-purple-600 to-violet-500"
                  >
                    Sign Up
                    <ArrowRight
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                      size={16}
                    />
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="justify-center flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Login
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
