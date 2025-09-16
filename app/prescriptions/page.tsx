"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Eye, Download, Search, X, Pill, Calendar, User, Building2, FileText, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"

interface Medicine {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

interface Prescription {
  id: string
  slNo: number
  date: string
  doctor: string
  hospital: string
  medicines: Medicine[]
  diagnosis: string
  notes: string
  status: "active" | "completed" | "expired"
  validUntil: string
}

export default function PrescriptionsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"emergency" | "dashboard" | "health-tips">("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    if (!user) return

    const savedPrescriptions = localStorage.getItem(`prescriptions-${user.id}`)
    if (savedPrescriptions) {
      setPrescriptions(JSON.parse(savedPrescriptions))
    } else {
      // Initialize with sample data
      const samplePrescriptions: Prescription[] = [
        {
          id: "1",
          slNo: 1,
          date: "2024-01-15",
          doctor: "Dr. Smith",
          hospital: "City Hospital",
          diagnosis: "Common Cold",
          notes: "Rest and stay hydrated",
          status: "active",
          validUntil: "2024-02-15",
          medicines: [
            {
              name: "Paracetamol",
              dosage: "500mg",
              frequency: "3 times daily",
              duration: "5 days",
              instructions: "Take after meals",
            },
            {
              name: "Amoxicillin",
              dosage: "250mg",
              frequency: "2 times daily",
              duration: "7 days",
              instructions: "Complete the full course",
            },
          ],
        },
        {
          id: "2",
          slNo: 2,
          date: "2024-01-10",
          doctor: "Dr. Johnson",
          hospital: "General Hospital",
          diagnosis: "Vitamin Deficiency",
          notes: "Regular monitoring required",
          status: "active",
          validUntil: "2024-04-10",
          medicines: [
            {
              name: "Ibuprofen",
              dosage: "400mg",
              frequency: "2 times daily",
              duration: "3 days",
              instructions: "Take with food",
            },
            {
              name: "Vitamin D",
              dosage: "1000 IU",
              frequency: "Once daily",
              duration: "30 days",
              instructions: "Take in the morning",
            },
          ],
        },
        {
          id: "3",
          slNo: 3,
          date: "2024-01-05",
          doctor: "Dr. Williams",
          hospital: "Metro Hospital",
          diagnosis: "Hypertension",
          notes: "Monitor blood pressure regularly",
          status: "completed",
          validUntil: "2024-02-05",
          medicines: [
            {
              name: "Aspirin",
              dosage: "75mg",
              frequency: "Once daily",
              duration: "30 days",
              instructions: "Take in the evening",
            },
            {
              name: "Calcium",
              dosage: "500mg",
              frequency: "2 times daily",
              duration: "30 days",
              instructions: "Take with meals",
            },
          ],
        },
      ]
      setPrescriptions(samplePrescriptions)
      localStorage.setItem(`prescriptions-${user.id}`, JSON.stringify(samplePrescriptions))
    }
  }, [user])

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
  }

  const handleDownloadPrescription = (prescription: Prescription) => {
    // Create a simple text representation for download
    const content = `
PRESCRIPTION
-----------
Date: ${prescription.date}
Doctor: ${prescription.doctor}
Hospital: ${prescription.hospital}
Diagnosis: ${prescription.diagnosis}

MEDICINES:
${prescription.medicines
  .map(
    (med) =>
      `- ${med.name} (${med.dosage}) - ${med.frequency} for ${med.duration}
    Instructions: ${med.instructions}`,
  )
  .join("\n")}

Notes: ${prescription.notes}
Valid Until: ${prescription.validUntil}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `prescription-${prescription.date}-${prescription.doctor.replace(/\s+/g, "-")}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
        <div className="text-white text-sm">
          <p className="font-medium">{user.name}</p>
          <p className="text-white/70 text-xs">E-Prescriptions</p>
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
          <h2 className="text-2xl font-bold text-black tracking-wider">e-PRESCRIPTIONS</h2>
        </div>
        <p className="text-white/70 mt-2">{prescriptions.length} prescriptions found</p>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search by doctor, hospital, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="px-6 pb-8">
        <Card className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2ecc71]">
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">SL NO</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">DATE</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">DOCTOR</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    HOSPITAL
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    DIAGNOSIS
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-black uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPrescriptions.map((prescription, index) => (
                  <tr
                    key={prescription.id}
                    className={`${index % 2 === 0 ? "bg-[#2ecc71]/20" : "bg-white"} hover:bg-[#2ecc71]/30 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {prescription.slNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prescription.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prescription.doctor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prescription.hospital}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prescription.diagnosis}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}
                      >
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          className="bg-[#001f3f] hover:bg-[#001f3f]/80 text-white h-8 w-8 p-0"
                          title="View Prescription"
                          onClick={() => handleViewPrescription(prescription)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#001f3f] text-[#001f3f] hover:bg-[#001f3f] hover:text-white h-8 w-8 p-0 bg-transparent"
                          title="Download Prescription"
                          onClick={() => handleDownloadPrescription(prescription)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPrescriptions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No prescriptions found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-[#2ecc71]" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Prescription Details</h3>
                    <p className="text-gray-600">#{selectedPrescription.slNo}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedPrescription(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{selectedPrescription.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Doctor</p>
                      <p className="font-medium">{selectedPrescription.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Hospital</p>
                      <p className="font-medium">{selectedPrescription.hospital}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <p className="font-medium">{selectedPrescription.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPrescription.status)}`}
                    >
                      {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Valid Until</p>
                      <p className="font-medium">{selectedPrescription.validUntil}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-[#2ecc71]" />
                  Prescribed Medicines
                </h4>
                <div className="space-y-4">
                  {selectedPrescription.medicines.map((medicine, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-gray-900">{medicine.name}</h5>
                          <p className="text-sm text-gray-600">Dosage: {medicine.dosage}</p>
                          <p className="text-sm text-gray-600">Frequency: {medicine.frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration: {medicine.duration}</p>
                          <p className="text-sm text-gray-600">Instructions: {medicine.instructions}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPrescription.notes && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Doctor's Notes</h4>
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{selectedPrescription.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPrescription(selectedPrescription)}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                <Button onClick={() => setSelectedPrescription(null)}>Close</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
