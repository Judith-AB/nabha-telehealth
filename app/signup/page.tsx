"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const [userType, setUserType] = useState<"patient" | "doctor">("patient")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    abhaId: "",
    aadharId: "",
  })
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    // Simulate signup - in real app, this would register with backend
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#1a365d] to-[#2d3748] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">SEHAT SATHI</h1>
          <h2 className="text-2xl font-light text-cyan-300 mb-8">SIGN UP</h2>
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

        {/* Signup Form */}
        <Card className="bg-gradient-to-b from-purple-600/80 to-blue-600/80 backdrop-blur-md border-0 shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-6">
              <p className="text-white/90 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-cyan-300 hover:text-cyan-200 underline">
                  Login here
                </Link>
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-white/20 border-0 text-white placeholder:text-white/60 h-12 rounded-xl backdrop-blur-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white/20 border-0 text-white placeholder:text-white/60 h-12 rounded-xl backdrop-blur-sm"
                  required
                />
                <Input
                  type="tel"
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className="bg-white/20 border-0 text-white placeholder:text-white/60 h-12 rounded-xl backdrop-blur-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-white/20 border-0 text-white placeholder:text-white/60 h-12 rounded-xl backdrop-blur-sm"
                  required
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="bg-white/20 border-0 text-white placeholder:text-white/60 h-12 rounded-xl backdrop-blur-sm"
                  required
                />
              </div>

              {userType === "patient" && (
                <>
                  <div>
                    <Input
                      type="text"
                      placeholder="ABHA ID (Optional)"
                      value={formData.abhaId}
                      onChange={(e) => handleInputChange("abhaId", e.target.value)}
                      className="bg-white/20 border-0 text-white placeholder:text-white/60 h-12 rounded-xl backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Aadhar ID"
                      value={formData.aadharId}
                      onChange={(e) => handleInputChange("aadharId", e.target.value)}
                      className="bg-white/20 border-0 text-white placeholder:text-white/60 h-12 rounded-xl backdrop-blur-sm"
                      required
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 mt-6"
              >
                CREATE ACCOUNT
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
