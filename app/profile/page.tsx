"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Edit,
  Save,
  Camera,
  Shield,
  Bell,
  Settings,
  LogOut,
  CheckCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState<"emergency" | "dashboard" | "health-tips">("dashboard")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    block: "",
    district: "",
    state: "",
    dob: "",
    abhaId: "",
    aadharId: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        block: user.block || "",
        district: user.district || "",
        state: user.state || "",
        dob: user.dob || "",
        abhaId: user.abhaId || "",
        aadharId: user.aadharId || "",
      })
    }
  }, [user, router])

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update user in context
    const updatedUser = { ...user, ...profileData }
    updateUser(updatedUser)

    setIsEditing(false)
    setIsSaving(false)
    setSaveSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleProfilePictureUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // In a real app, this would upload to a server
        alert(`Profile picture "${file.name}" would be uploaded`)
      }
    }
    input.click()
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
        <Button variant="ghost" size="icon" className="text-white hover:bg-red-500/20" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
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
          <h2 className="text-2xl font-bold text-black tracking-wider">PROFILE</h2>
        </div>
        <p className="text-white/70 mt-2">{user.userType === "patient" ? "Patient Profile" : "Doctor Profile"}</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="px-6 mb-6">
          <Card className="max-w-4xl mx-auto bg-green-50 border-green-200">
            <div className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-800 font-medium">Profile updated successfully!</p>
            </div>
          </Card>
        </div>
      )}

      {/* Profile Content */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <Card className="bg-[#2ecc71] border-0 shadow-xl">
                <div className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 bg-black/20 rounded-2xl flex items-center justify-center">
                      <User className="h-16 w-16 text-black/50" />
                    </div>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 bg-black/20 hover:bg-black/30 text-black border-0 rounded-full h-8 w-8 p-0"
                      onClick={handleProfilePictureUpload}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{profileData.name}</h3>
                  <p className="text-black/70 text-sm mb-4">
                    {user.userType === "patient" ? "Patient ID: #12345" : "Doctor ID: #DOC789"}
                  </p>

                  <div className="space-y-3 mb-6">
                    <Button
                      className="w-full bg-[#27ae60] hover:bg-[#229954] text-white"
                      onClick={() => router.push("/health-records")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      HEALTH RECORDS
                    </Button>

                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => router.push("/consultation-history")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      CONSULTATIONS
                    </Button>
                  </div>

                  <div className="flex items-center justify-center space-x-2 bg-black/10 rounded-lg p-3">
                    <Calendar className="h-5 w-5 text-black/70" />
                    <div className="text-left">
                      <span className="text-black font-medium block">DOB</span>
                      <span className="text-black/70 text-sm">{profileData.dob || "Not set"}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl mt-6">
                <div className="p-6">
                  <h4 className="text-white font-bold mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Quick Settings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">Notifications</span>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">Privacy</span>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="bg-[#2ecc71] border-0 shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-black">Personal Information</h3>
                    <Button
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                      className="bg-black/20 hover:bg-black/30 text-black border-0"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Saving...
                        </>
                      ) : isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-black font-medium mb-2">Name :</label>
                      {isEditing ? (
                        <Input
                          value={profileData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="bg-white/20 border-0 text-black placeholder:text-black/60"
                        />
                      ) : (
                        <div className="bg-white/20 rounded-lg p-3 text-black">{profileData.name}</div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-black font-medium mb-2">Email :</label>
                      {isEditing ? (
                        <Input
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-white/20 border-0 text-black placeholder:text-black/60"
                          type="email"
                        />
                      ) : (
                        <div className="bg-white/20 rounded-lg p-3 text-black">{profileData.email}</div>
                      )}
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-black font-medium mb-2">Mobile :</label>
                      {isEditing ? (
                        <Input
                          value={profileData.mobile}
                          onChange={(e) => handleInputChange("mobile", e.target.value)}
                          className="bg-white/20 border-0 text-black placeholder:text-black/60"
                          type="tel"
                        />
                      ) : (
                        <div className="bg-white/20 rounded-lg p-3 text-black">{profileData.mobile}</div>
                      )}
                    </div>

                    {/* DOB */}
                    <div>
                      <label className="block text-black font-medium mb-2">Date of Birth :</label>
                      {isEditing ? (
                        <Input
                          value={profileData.dob}
                          onChange={(e) => handleInputChange("dob", e.target.value)}
                          className="bg-white/20 border-0 text-black placeholder:text-black/60"
                          type="date"
                        />
                      ) : (
                        <div className="bg-white/20 rounded-lg p-3 text-black">{profileData.dob || "Not set"}</div>
                      )}
                    </div>

                    {/* Block */}
                    <div>
                      <label className="block text-black font-medium mb-2">Block :</label>
                      {isEditing ? (
                        <Input
                          value={profileData.block}
                          onChange={(e) => handleInputChange("block", e.target.value)}
                          className="bg-white/20 border-0 text-black placeholder:text-black/60"
                        />
                      ) : (
                        <div className="bg-white/20 rounded-lg p-3 text-black">{profileData.block}</div>
                      )}
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-black font-medium mb-2">District :</label>
                      {isEditing ? (
                        <Input
                          value={profileData.district}
                          onChange={(e) => handleInputChange("district", e.target.value)}
                          className="bg-white/20 border-0 text-black placeholder:text-black/60"
                        />
                      ) : (
                        <div className="bg-white/20 rounded-lg p-3 text-black">{profileData.district}</div>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-black font-medium mb-2">State :</label>
                      {isEditing ? (
                        <Input
                          value={profileData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          className="bg-white/20 border-0 text-black placeholder:text-black/60"
                        />
                      ) : (
                        <div className="bg-white/20 rounded-lg p-3 text-black">{profileData.state}</div>
                      )}
                    </div>

                    {/* User Type Specific Field */}
                    <div>
                      <label className="block text-black font-medium mb-2">
                        {user.userType === "patient" ? "Patient Type :" : "Specialization :"}
                      </label>
                      <div className="bg-white/20 rounded-lg p-3 text-black">
                        {user.userType === "patient" ? "General Patient" : "General Physician"}
                      </div>
                    </div>

                    {/* ABHA ID */}
                    <div>
                      <label className="block text-black font-medium mb-2">ABHA ID :</label>
                      {isEditing ? (
                        <Input
                          value={profileData.abhaId}
                          onChange={(e) => handleInputChange("abhaId", e.target.value)}
                          className="bg-white/20 border-0 text-black placeholder:text-black/60"
                          placeholder="12-3456-7890-1234"
                        />
                      ) : (
                        <div className="bg-white/20 rounded-lg p-3 text-black">{profileData.abhaId}</div>
                      )}
                    </div>

                    {/* Aadhar ID */}
                    <div>
                      <label className="block text-black font-medium mb-2">AADHAR ID :</label>
                      {isEditing ? (
                        <Input
                          value={profileData.aadharId}
                          onChange={(e) => handleInputChange("aadharId", e.target.value)}
                          className="bg-white/20 border-0 text-black placeholder:text-black/60"
                          placeholder="1234 5678 9012"
                        />
                      ) : (
                        <div className="bg-white/20 rounded-lg p-3 text-black">{profileData.aadharId}</div>
                      )}
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="mt-8 pt-6 border-t border-black/20">
                      <h4 className="text-black font-bold mb-4">Account Actions</h4>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          className="border-black/20 text-black hover:bg-black/10 bg-transparent"
                          onClick={() => alert("Password change functionality would be implemented here")}
                        >
                          Change Password
                        </Button>
                        <Button
                          variant="outline"
                          className="border-black/20 text-black hover:bg-black/10 bg-transparent"
                          onClick={() => alert("Data export functionality would be implemented here")}
                        >
                          Export Data
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                          onClick={() => {
                            if (
                              confirm("Are you sure you want to delete your account? This action cannot be undone.")
                            ) {
                              alert("Account deletion would be processed here")
                            }
                          }}
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
