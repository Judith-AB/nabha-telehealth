"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Languages, UserCircle, AlertTriangle, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

interface NavigationHeaderProps {
  showBackButton?: boolean
  title?: string
}

export function NavigationHeader({ showBackButton = false, title = "SEHAT SATHI" }: NavigationHeaderProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"emergency" | "dashboard" | "health-tips">("dashboard")

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-3xl font-bold text-white tracking-wider">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Languages className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <UserCircle className="h-5 w-5" />
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
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-[#2ecc71] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Daily Exercise</h3>
                  <p className="text-white/80">
                    Regular physical activity helps maintain good health and prevents chronic diseases.
                  </p>
                </div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-[#2ecc71] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Healthy Diet</h3>
                  <p className="text-white/80">
                    Eat a balanced diet rich in fruits, vegetables, and whole grains for optimal health.
                  </p>
                </div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-[#2ecc71] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Stay Hydrated</h3>
                  <p className="text-white/80">
                    Drink at least 8 glasses of water daily to keep your body properly hydrated.
                  </p>
                </div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-0">
                <div className="p-6">
                  <Heart className="h-8 w-8 text-[#2ecc71] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Regular Checkups</h3>
                  <p className="text-white/80">
                    Schedule regular health checkups to detect and prevent health issues early.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
