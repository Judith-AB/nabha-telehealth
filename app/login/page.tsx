"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [userType, setUserType] = useState<"patient" | "doctor">("patient")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: email
        .split("@")[0]
        .replace(/[^a-zA-Z]/g, "")
        .replace(/^\w/, (c) => c.toUpperCase()),
      email,
      mobile: "+91 98765 43210",
      userType,
      block: "Central Block",
      district: "New Delhi",
      state: "Delhi",
      dob: "1990-01-01",
      abhaId: "12-3456-7890-1234",
      aadharId: "1234 5678 9012",
    }

    login(mockUser)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#1a365d] to-[#2d3748] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">SEHAT SATHI</h1>
          <h2 className="text-2xl font-light text-cyan-300 mb-8">LOGIN</h2>
        </div>

        {/* User Type Toggle */}
        <div className="flex mb-6 bg-black/30 rounded-full p-1 backdrop-blur-sm border border-white/20">
          <button
            onClick={() => setUserType("patient")}
            className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
              userType === "patient"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "text-white hover:text-white hover:bg-white/10"
            }`}
          >
            PATIENT
          </button>
          <button
            onClick={() => setUserType("doctor")}
            className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
              userType === "doctor"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-white hover:text-white hover:bg-white/10"
            }`}
          >
            CHO / DOCTOR
          </button>
        </div>

        {/* Login Form */}
        <Card className="bg-gradient-to-b from-purple-600/80 to-blue-600/80 backdrop-blur-md border-0 shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-6">
              <p className="text-white/90 text-sm">
                {"Don't have an account? "}
                <Link href="/signup" className="text-cyan-300 hover:text-cyan-200 underline">
                  Click here
                </Link>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-0 text-white placeholder:text-white/60 h-12 rounded-xl backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/20 border-0 text-white placeholder:text-white/60 h-12 rounded-xl backdrop-blur-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                LOGIN
              </Button>
            </form>
          </div>
        </Card>

        {/* Language and Profile Icons */}
        <div className="flex justify-end mt-6 space-x-4">
          <div className="w-10 h-10 bg-black/40 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
            <span className="text-white text-lg">🌐</span>
          </div>
          <div className="w-10 h-10 bg-black/40 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
            <span className="text-white text-lg">👤</span>
          </div>
        </div>
      </div>
    </div>
  )
}
