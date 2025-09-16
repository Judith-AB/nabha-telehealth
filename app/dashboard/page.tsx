"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Stethoscope,
  FileText,
  History,
  Pill,
  MapPin,
  User,
  AlertTriangle,
  Heart,
  Languages,
  UserCircle,
  LogOut,
} from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"emergency" | "dashboard" | "health-tips">("dashboard")
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#1a365d] to-[#2d3748] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const dashboardItems = [
    {
      title: "CONSULT NOW",
      icon: Stethoscope,
      href: "/consult",
      description: "Book instant consultation",
    },
    {
      title: "HEALTH RECORDS",
      icon: FileText,
      href: "/health-records",
      description: "View your medical history",
    },
    {
      title: "CONSULTATION HISTORY",
      icon: History,
      href: "/consultation-history",
      description: "Past consultations",
    },
    {
      title: "e-PRESCRIPTIONS",
      icon: Pill,
      href: "/prescriptions",
      description: "Digital prescriptions",
    },
    {
      title: "PHARMACY LOCATOR",
      icon: MapPin,
      href: "/pharmacy",
      description: "Find nearby pharmacies",
    },
    {
      title: "PROFILE",
      icon: User,
      href: "/profile",
      description: "Manage your profile",
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#1a365d] to-[#2d3748]">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-white tracking-wider">SEHAT SATHI</h1>

        <div className="flex items-center space-x-4">
          <div className="text-white text-sm">
            <p className="font-medium">Welcome, {user.name}</p>
            <p className="text-white/70 text-xs">{user.userType === "patient" ? "Patient" : "Doctor"}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Languages className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => router.push("/profile")}
          >
            <UserCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-red-500/20" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex justify-center px-6 py-4">
        <div className="flex bg-white/10 rounded-full p-1 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("emergency")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "emergency" ? "bg-red-500 text-white shadow-lg" : "text-white/70 hover:text-white"
            }`}
          >
            EMERGENCY
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "dashboard" ? "bg-[#2ecc71] text-black shadow-lg" : "text-white/70 hover:text-white"
            }`}
          >
            DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab("health-tips")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "health-tips" ? "bg-cyan-400 text-black shadow-lg" : "text-white/70 hover:text-white"
            }`}
          >
            HEALTH TIPS
          </button>
        </div>
      </div>

      {/* Dashboard Title */}
      <div className="text-center py-8">
        <h2 className="text-5xl font-bold text-[#2ecc71] tracking-wider">DASHBOARD</h2>
        <p className="text-white/70 mt-2">Manage your health journey, {user.name}</p>
      </div>

      {/* Dashboard Grid */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {dashboardItems.map((item, index) => (
            <Card
              key={index}
              className="bg-[#2ecc71] hover:bg-[#27ae60] transition-all duration-300 transform hover:scale-105 cursor-pointer border-0 shadow-xl"
              onClick={() => router.push(item.href)}
            >
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <item.icon className="h-12 w-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2 tracking-wide">{item.title}</h3>
                <p className="text-black/70 text-sm">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Tab Content */}
      {activeTab === "emergency" && (
        <div className="fixed inset-0 bg-red-500/90 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-white p-8 max-w-md mx-4">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-500 mb-4">EMERGENCY</h3>
              <p className="text-gray-600 mb-6">
                In case of emergency, please call the nearest hospital or emergency services.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Call 108 (Ambulance)</Button>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Call 102 (Emergency)</Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setActiveTab("dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Health Tips Tab Content */}
      {activeTab === "health-tips" && (
        <div className="px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-[#2ecc71] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Daily Exercise</h3>
                  <p className="text-white/80 mb-3">
                    Regular physical activity helps maintain good health and prevents chronic diseases.
                  </p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• 30 minutes of moderate exercise daily</li>
                    <li>• Include cardio and strength training</li>
                    <li>• Take stairs instead of elevators</li>
                  </ul>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-[#2ecc71] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Healthy Diet</h3>
                  <p className="text-white/80 mb-3">
                    Eat a balanced diet rich in fruits, vegetables, and whole grains for optimal health.
                  </p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• 5 servings of fruits and vegetables daily</li>
                    <li>• Choose whole grains over refined</li>
                    <li>• Limit processed and sugary foods</li>
                  </ul>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Stay Hydrated</h3>
                  <p className="text-white/80 mb-3">
                    Proper hydration is essential for all bodily functions and overall health.
                  </p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Drink 8-10 glasses of water daily</li>
                    <li>• Start your day with a glass of water</li>
                    <li>• Limit caffeine and alcohol intake</li>
                  </ul>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Quality Sleep</h3>
                  <p className="text-white/80 mb-3">
                    Good sleep is crucial for physical health, mental well-being, and immune function.
                  </p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• 7-9 hours of sleep per night</li>
                    <li>• Maintain consistent sleep schedule</li>
                    <li>• Create a relaxing bedtime routine</li>
                  </ul>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Stress Management</h3>
                  <p className="text-white/80 mb-3">
                    Managing stress effectively improves both mental and physical health.
                  </p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Practice meditation or deep breathing</li>
                    <li>• Engage in hobbies you enjoy</li>
                    <li>• Maintain social connections</li>
                  </ul>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-orange-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Regular Checkups</h3>
                  <p className="text-white/80 mb-3">
                    Preventive healthcare helps detect and prevent health issues early.
                  </p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Annual health screenings</li>
                    <li>• Regular dental and eye checkups</li>
                    <li>• Stay up-to-date with vaccinations</li>
                  </ul>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-pink-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Mental Health</h3>
                  <p className="text-white/80 mb-3">
                    Taking care of your mental health is just as important as physical health.
                  </p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Practice mindfulness and gratitude</li>
                    <li>• Seek help when needed</li>
                    <li>• Maintain work-life balance</li>
                  </ul>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-green-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Hygiene Habits</h3>
                  <p className="text-white/80 mb-3">
                    Good hygiene practices prevent infections and promote overall health.
                  </p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Wash hands frequently with soap</li>
                    <li>• Brush teeth twice daily</li>
                    <li>• Maintain personal cleanliness</li>
                  </ul>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-yellow-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Avoid Harmful Habits</h3>
                  <p className="text-white/80 mb-3">
                    Eliminating harmful habits significantly improves your health and longevity.
                  </p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Quit smoking and tobacco use</li>
                    <li>• Limit alcohol consumption</li>
                    <li>• Avoid excessive screen time</li>
                  </ul>
                </div>
              </Card>
            </div>

            <div className="mt-8">
              <Card className="bg-gradient-to-r from-[#2ecc71]/20 to-cyan-400/20 backdrop-blur-sm border-0">
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-3">💡 Daily Health Tip</h3>
                  <p className="text-white/90 text-lg mb-2">
                    "Start your morning with a glass of warm water and lemon to boost metabolism and aid digestion."
                  </p>
                  <p className="text-white/70 text-sm">Tip of the day • Updated daily with new health insights</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
