"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    full_name: "",
    password: "",
    password_confirm: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/signup/", form);

      localStorage.setItem("access", res.data.tokens.access);
      localStorage.setItem("refresh", res.data.tokens.refresh);

      router.push("/competitions");
    } catch (err) {
      alert("Signup failed");
      console.log(err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-5"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Join Briefs Management System</p>
        </div>

        <input
          className="border border-gray-300 rounded-lg p-3 w-full"
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />

        <input
          className="border border-gray-300 rounded-lg p-3 w-full"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border border-gray-300 rounded-lg p-3 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          className="border border-gray-300 rounded-lg p-3 w-full"
          type="password"
          placeholder="Confirm Password"
          onChange={(e) =>
            setForm({ ...form, password_confirm: e.target.value })
          }
        />

        <button className="bg-black text-white rounded-lg p-3 w-full font-semibold hover:bg-gray-800">
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-black">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}