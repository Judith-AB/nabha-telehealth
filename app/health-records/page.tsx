"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, FileText, Download, Eye, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface HealthRecord {
  id: string
  name: string
  date: string
  size: string
  type: "image" | "pdf"
}

interface RecordCategory {
  title: string
  records: HealthRecord[]
  color: string
}

export default function HealthRecordsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<"emergency" | "dashboard" | "health-tips">("dashboard")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewingRecord, setViewingRecord] = useState<HealthRecord | null>(null)

  const [recordCategories, setRecordCategories] = useState<RecordCategory[]>([
    {
      title: "BLOOD TESTS",
      records: [
        { id: "1", name: "Complete Blood Count", date: "2024-01-15", size: "2.3 MB", type: "pdf" },
        { id: "2", name: "Lipid Profile", date: "2024-01-10", size: "1.8 MB", type: "pdf" },
      ],
      color: "bg-[#2ecc71]",
    },
    {
      title: "OP RECORDS",
      records: [
        { id: "3", name: "Consultation Report", date: "2024-01-20", size: "1.5 MB", type: "pdf" },
        { id: "4", name: "Follow-up Notes", date: "2024-01-18", size: "0.8 MB", type: "pdf" },
      ],
      color: "bg-[#2ecc71]",
    },
    {
      title: "DISCHARGE SUMMARY",
      records: [{ id: "5", name: "Hospital Discharge", date: "2024-01-12", size: "3.2 MB", type: "pdf" }],
      color: "bg-[#2ecc71]",
    },
    {
      title: "X-RAY REPORTS",
      records: [
        { id: "6", name: "Chest X-Ray", date: "2024-01-08", size: "4.1 MB", type: "image" },
        { id: "7", name: "Spine X-Ray", date: "2024-01-05", size: "3.8 MB", type: "image" },
      ],
      color: "bg-[#2ecc71]",
    },
  ])

  const handleFileUpload = (categoryTitle: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("data-category", categoryTitle)
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const categoryTitle = event.target.getAttribute("data-category")

    if (files && categoryTitle) {
      Array.from(files).forEach((file) => {
        const newRecord: HealthRecord = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          date: new Date().toISOString().split("T")[0],
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type.startsWith("image/") ? "image" : "pdf",
        }

        setRecordCategories((prev) =>
          prev.map((category) =>
            category.title === categoryTitle ? { ...category, records: [...category.records, newRecord] } : category,
          ),
        )
      })
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleViewRecord = (record: HealthRecord) => {
    setViewingRecord(record)
  }

  const handleDownloadRecord = (record: HealthRecord) => {
    // Simulate download
    const link = document.createElement("a")
    link.href = `/placeholder.svg?height=400&width=600&query=${record.name}`
    link.download = record.name
    link.click()
  }

  const handleDeleteRecord = (categoryTitle: string, recordId: string) => {
    setRecordCategories((prev) =>
      prev.map((category) =>
        category.title === categoryTitle
          ? { ...category, records: category.records.filter((r) => r.id !== recordId) }
          : category,
      ),
    )
  }

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
          <p className="font-medium">{user?.name}</p>
          <p className="text-white/70 text-xs">Health Records</p>
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
          <h2 className="text-2xl font-bold text-black tracking-wider">HEALTH RECORDS</h2>
        </div>
      </div>

      {/* Records Grid */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {recordCategories.map((category, index) => (
            <Card
              key={index}
              className={`${category.color} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-black tracking-wide">{category.title}</h3>
                  <FileText className="h-6 w-6 text-black/70" />
                </div>

                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                  {category.records.map((record, recordIndex) => (
                    <div key={record.id} className="flex items-center justify-between bg-black/10 rounded-lg p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">
                          {recordIndex + 1}. {record.name}
                        </p>
                        <p className="text-xs text-black/70">
                          {record.date} • {record.size}
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-black/20"
                          onClick={() => handleViewRecord(record)}
                        >
                          <Eye className="h-4 w-4 text-black" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-black/20"
                          onClick={() => handleDownloadRecord(record)}
                        >
                          <Download className="h-4 w-4 text-black" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-red-500/20"
                          onClick={() => handleDeleteRecord(category.title, record.id)}
                        >
                          <X className="h-4 w-4 text-black" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {category.records.length === 0 && (
                    <p className="text-black/50 text-sm text-center py-4">No records yet</p>
                  )}
                </div>

                <Button
                  className="w-full bg-black/20 hover:bg-black/30 text-black border-0 rounded-full"
                  onClick={() => handleFileUpload(category.title)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Record Viewer Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{viewingRecord.name}</h3>
                  <p className="text-gray-600">
                    {viewingRecord.date} • {viewingRecord.size}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewingRecord(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                {viewingRecord.type === "image" ? (
                  <img
                    src={`/abstract-geometric-shapes.png?height=400&width=600&query=${viewingRecord.name}`}
                    alt={viewingRecord.name}
                    className="max-w-full max-h-96 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="py-16">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">PDF Preview</p>
                    <p className="text-sm text-gray-500 mt-2">{viewingRecord.name}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
