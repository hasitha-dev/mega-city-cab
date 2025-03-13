import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
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
      const res = await fetch("http://localhost:8070/api/user/signup", {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-purple-900">
        <title>Sign Up | My App</title>
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                  <User className="h-8 w-8 text-indigo-400" />
                </div>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-white">
                Create an Account
              </h2>
              <p className="mt-2 text-indigo-200">Sign up to get started</p>
            </div>

            <Card className="border-indigo-500/10 shadow-xl shadow-indigo-900/20 backdrop-blur-lg bg-gray-800/60">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center text-white">
                  Sign Up
                </CardTitle>
                <CardDescription className="text-center text-gray-300">
                  Enter your details to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-200">
                      Username
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-4 w-4 text-indigo-300" />
                      </div>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Your username"
                        className="pl-10 border-gray-700 bg-gray-700/50 text-white"
                        {...formik.getFieldProps("username")}
                      />
                    </div>
                    {formik.touched.username && formik.errors.username && (
                      <p className="text-sm text-red-400">
                        {formik.errors.username}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200">
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-4 w-4 text-indigo-300" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10 border-gray-700 bg-gray-700/50 text-white"
                        {...formik.getFieldProps("email")}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-sm text-red-400">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-200">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-indigo-300" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 border-gray-700 bg-gray-700/50 text-white"
                        {...formik.getFieldProps("password")}
                      />
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-sm text-red-400">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-200">
                      Address
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Home className="h-4 w-4 text-indigo-300" />
                      </div>
                      <Input
                        id="address"
                        type="text"
                        placeholder="Your address"
                        className="pl-10 border-gray-700 bg-gray-700/50 text-white"
                        {...formik.getFieldProps("address")}
                      />
                    </div>
                    {formik.touched.address && formik.errors.address && (
                      <p className="text-sm text-red-400">
                        {formik.errors.address}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-200">
                      Phone
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-4 w-4 text-indigo-300" />
                      </div>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="1234567890"
                        className="pl-10 border-gray-700 bg-gray-700/50 text-white"
                        {...formik.getFieldProps("phone")}
                      />
                    </div>
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-sm text-red-400">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full group transition-all hover:shadow-md bg-gradient-to-r from-indigo-600 to-purple-600"
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
                <div className="text-sm text-center text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-400 font-medium hover:underline"
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
