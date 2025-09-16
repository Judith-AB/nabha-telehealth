"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Eye, Search, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"

interface Consultation {
  id: string
  date: string
  time: string
  type: "video" | "audio" | "chat"
  symptoms: string
  doctorPreference: string
  isEmergency: boolean
  status: "scheduled" | "completed" | "cancelled"
  doctorName?: string
  meetingLink?: string
}

export default function ConsultationHistoryPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"emergency" | "dashboard" | "health-tips">("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [consultations, setConsultations] = useState<Consultation[]>([])

  useEffect(() => {
    if (user?.id) {
      const savedConsultations = localStorage.getItem(`consultations-${user.id}`)
      if (savedConsultations) {
        const parsedConsultations = JSON.parse(savedConsultations)
        setConsultations(parsedConsultations)
      }
    }
  }, [user?.id])

  const displayConsultations = consultations.map((consultation, index) => ({
    slNo: index + 1,
    date: consultation.date,
    condition: consultation.symptoms || "General Consultation",
    doctor: consultation.doctorName || "Dr. Available",
    hospital: consultation.isEmergency ? "Emergency Department" : "General Hospital",
    status: consultation.status,
    type: consultation.type,
    time: consultation.time,
    isEmergency: consultation.isEmergency,
    meetingLink: consultation.meetingLink,
  }))

  const filteredConsultations = displayConsultations.filter(
    (consultation) =>
      consultation.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.hospital.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#1a365d] to-[#2d3748]">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white tracking-wider">SEHAT SATHI</h1>
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

      {/* Page Title */}
      <div className="text-center py-6">
        <div className="inline-block bg-[#2ecc71] px-8 py-3 rounded-full">
          <h2 className="text-2xl font-bold text-black tracking-wider">CONSULTATION HISTORY</h2>
        </div>
        <p className="text-white/70 mt-2">
          {consultations.length > 0
            ? `${consultations.length} consultation${consultations.length > 1 ? "s" : ""} found for ${user.name}`
            : `No consultations yet, ${user.name}`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search by condition, doctor, or hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      {/* Consultation History Table */}
      <div className="px-6 pb-8">
        <Card className="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2ecc71]">
                  <th className="px-4 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">SL NO</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>DATE & TIME</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    CONDITION
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">DOCTOR</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    TYPE & STATUS
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-bold text-black uppercase tracking-wider">
                    <Eye className="h-4 w-4 mx-auto" />
                    VIEW
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredConsultations.length === 0 && consultations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <Calendar className="h-12 w-12 text-gray-300" />
                        <p className="text-lg font-medium">No consultations yet</p>
                        <p className="text-sm">Book your first consultation to see it here</p>
                        <Button
                          onClick={() => router.push("/consult")}
                          className="mt-4 bg-[#2ecc71] hover:bg-[#27ae60] text-white"
                        >
                          Book Consultation
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : filteredConsultations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      <p>No consultations match your search criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredConsultations.map((consultation, index) => (
                    <tr
                      key={consultation.slNo}
                      className={`${index % 2 === 0 ? "bg-[#2ecc71]/20" : "bg-white"} hover:bg-[#2ecc71]/30 transition-colors duration-200`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {consultation.slNo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>
                          <div className="font-medium">{consultation.date}</div>
                          <div className="text-xs text-gray-500">{consultation.time}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">
                        <div className="truncate" title={consultation.condition}>
                          {consultation.condition}
                        </div>
                        {consultation.isEmergency && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Emergency
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{consultation.doctor}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>
                          <div className="capitalize font-medium">{consultation.type}</div>
                          <span
                            className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                              consultation.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : consultation.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {consultation.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <Button
                          size="sm"
                          className="bg-[#001f3f] hover:bg-[#001f3f]/80 text-white h-8 w-8 p-0"
                          title="View Consultation Details"
                          onClick={() => {
                            if (consultation.meetingLink && consultation.status === "scheduled") {
                              window.open(consultation.meetingLink, "_blank")
                            } else {
                              alert(
                                `Consultation Details:\nDate: ${consultation.date}\nTime: ${consultation.time}\nType: ${consultation.type}\nStatus: ${consultation.status}`,
                              )
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
