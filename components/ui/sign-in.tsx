"use client";

import { SunIcon as Sunburst } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Logo } from "../header";
import Link from "next/link";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value: string) => {
    return value.length >= 8;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    setSubmitted(true);

    if (valid) {
      // Submission logic goes here
      console.log("Form submitted!");
      console.log("Email:", email);
      alert("Form submitted!");
      setEmail("");
      setPassword("");
      setSubmitted(false);
    }
  };

  return (
    <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white z-50 text-slate-900">
      <div className="flex flex-col items-left mb-8">
        <div className="mb-6 h-16 overflow-hidden flex items-center -ml-14">
          <Logo />
        </div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-left text-slate-600">
          Sign in to continue your learning journey with Everlore
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-slate-300 hover:bg-slate-50 text-slate-900 font-medium py-3 flex items-center justify-center gap-2 mb-6"
        onClick={() => console.log("Google sign-in clicked")}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-600">Or with email</span>
        </div>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            className={`text-sm w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black transition-all ${
              emailError ?
                "border-red-500 focus:ring-red-400"
              : "border-slate-300 focus:ring-green-500"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!emailError}
            aria-describedby="email-error"
          />
          {emailError && (
            <p
              id="email-error"
              className="text-red-500 text-xs mt-1"
            >
              {emailError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className={`text-sm w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black transition-all ${
              passwordError ?
                "border-red-500 focus:ring-red-400"
              : "border-slate-300 focus:ring-green-500"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!passwordError}
            aria-describedby="password-error"
          />
          {passwordError && (
            <p
              id="password-error"
              className="text-red-500 text-xs mt-1"
            >
              {passwordError}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
        >
          Sign In
        </Button>

        <div className="text-center text-slate-600 text-sm">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Create one
          </Link>
        </div>
      </form>
    </div>
  );
};
