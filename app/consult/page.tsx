"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { NavigationHeader } from "@/components/navigation-header"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Stethoscope, Calendar, Clock, User, Phone, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"

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

export default function ConsultPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [consultationType, setConsultationType] = useState<"video" | "audio" | "chat">("video")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [doctorPreference, setDoctorPreference] = useState("")
  const [isEmergency, setIsEmergency] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [consultations, setConsultations] = useState<Consultation[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    const savedConsultations = localStorage.getItem(`consultations-${user?.id}`)
    if (savedConsultations) {
      setConsultations(JSON.parse(savedConsultations))
    }
  }, [user?.id])

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]

  const handleBookConsultation = async () => {
    if (!user) return

    setIsBooking(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newConsultation: Consultation = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      time: selectedTime,
      type: consultationType,
      symptoms,
      doctorPreference,
      isEmergency,
      status: "scheduled",
      doctorName: isEmergency ? "Dr. Emergency Smith" : "Dr. Available Jones",
      meetingLink:
        consultationType !== "chat"
          ? `https://meet.sehat-sathi.com/${Math.random().toString(36).substr(2, 9)}`
          : undefined,
    }

    const updatedConsultations = [...consultations, newConsultation]
    setConsultations(updatedConsultations)
    localStorage.setItem(`consultations-${user.id}`, JSON.stringify(updatedConsultations))

    setIsBooking(false)
    setBookingSuccess(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setBookingSuccess(false)
      setSelectedDate("")
      setSelectedTime("")
      setSymptoms("")
      setDoctorPreference("")
      setIsEmergency(false)
    }, 3000)
  }

  const isTimeSlotAvailable = (date: string, time: string) => {
    return !consultations.some((c) => c.date === date && c.time === time && c.status === "scheduled")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#1a365d] to-[#2d3748]">
      <NavigationHeader showBackButton={true} />

      {/* Page Title */}
      <div className="text-center py-6">
        <div className="inline-block bg-[#2ecc71] px-8 py-3 rounded-full">
          <h2 className="text-2xl font-bold text-black tracking-wider">CONSULT NOW</h2>
        </div>
        <p className="text-white/70 mt-2">Book your consultation, {user.name}</p>
      </div>

      {/* Success Message */}
      {bookingSuccess && (
        <div className="px-6 mb-6">
          <Card className="max-w-4xl mx-auto bg-green-50 border-green-200">
            <div className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Consultation Booked Successfully!</h3>
              <p className="text-green-700">You will receive a confirmation email shortly.</p>
            </div>
          </Card>
        </div>
      )}

      {/* Consultation Form */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <Stethoscope className="h-8 w-8 text-[#2ecc71] mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">Book Your Consultation</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Consultation Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Consultation Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setConsultationType("video")}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          consultationType === "video"
                            ? "border-[#2ecc71] bg-[#2ecc71]/10"
                            : "border-gray-200 hover:border-[#2ecc71]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto mb-2 text-[#2ecc71]">📹</div>
                          <span className="text-sm font-medium">Video</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setConsultationType("audio")}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          consultationType === "audio"
                            ? "border-[#2ecc71] bg-[#2ecc71]/10"
                            : "border-gray-200 hover:border-[#2ecc71]/50"
                        }`}
                      >
                        <div className="text-center">
                          <Phone className="w-8 h-8 mx-auto mb-2 text-[#2ecc71]" />
                          <span className="text-sm font-medium">Audio</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setConsultationType("chat")}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          consultationType === "chat"
                            ? "border-[#2ecc71] bg-[#2ecc71]/10"
                            : "border-gray-200 hover:border-[#2ecc71]/50"
                        }`}
                      >
                        <div className="text-center">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#2ecc71]" />
                          <span className="text-sm font-medium">Chat</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Select Date
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Clock className="inline h-4 w-4 mr-2" />
                      Select Time
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => {
                        const available = !selectedDate || isTimeSlotAvailable(selectedDate, time)
                        return (
                          <button
                            key={time}
                            onClick={() => available && setSelectedTime(time)}
                            disabled={!available}
                            className={`p-3 rounded-lg border transition-all duration-300 ${
                              selectedTime === time
                                ? "border-[#2ecc71] bg-[#2ecc71] text-white"
                                : available
                                  ? "border-gray-200 hover:border-[#2ecc71] hover:bg-[#2ecc71]/10"
                                  : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {time}
                            {!available && <span className="block text-xs">Booked</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Describe Your Symptoms</label>
                    <Textarea
                      placeholder="Please describe your symptoms, concerns, or reason for consultation..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  {/* Doctor Preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <User className="inline h-4 w-4 mr-2" />
                      Doctor Preference (Optional)
                    </label>
                    <select
                      value={doctorPreference}
                      onChange={(e) => setDoctorPreference(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent"
                    >
                      <option value="">Any Available Doctor</option>
                      <option value="general">General Physician</option>
                      <option value="cardiologist">Cardiologist</option>
                      <option value="dermatologist">Dermatologist</option>
                      <option value="pediatrician">Pediatrician</option>
                    </select>
                  </div>

                  {/* Emergency Priority */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="emergency"
                        checked={isEmergency}
                        onChange={(e) => setIsEmergency(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="emergency" className="text-sm font-medium text-red-700">
                        This is an emergency consultation
                      </label>
                    </div>
                    <p className="text-xs text-red-600">Check this if you need immediate medical attention</p>
                  </div>

                  {/* Book Button */}
                  <Button
                    onClick={handleBookConsultation}
                    className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white py-4 text-lg font-semibold"
                    disabled={!selectedDate || !selectedTime || !symptoms.trim() || isBooking}
                  >
                    {isBooking ? "Booking..." : "Book Consultation"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {consultations.length > 0 && (
            <Card className="mt-8 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Your Upcoming Consultations</h3>
                <div className="space-y-4">
                  {consultations
                    .filter((c) => c.status === "scheduled")
                    .sort(
                      (a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime(),
                    )
                    .slice(0, 3)
                    .map((consultation) => (
                      <div
                        key={consultation.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-full ${consultation.isEmergency ? "bg-red-100" : "bg-[#2ecc71]/10"}`}
                          >
                            {consultation.isEmergency ? (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <Stethoscope className="h-5 w-5 text-[#2ecc71]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {consultation.type.charAt(0).toUpperCase() + consultation.type.slice(1)} Consultation
                            </p>
                            <p className="text-sm text-gray-600">
                              {consultation.date} at {consultation.time}
                            </p>
                            <p className="text-sm text-gray-600">Dr. {consultation.doctorName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              consultation.isEmergency ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {consultation.isEmergency ? "Emergency" : "Scheduled"}
                          </span>
                          {consultation.meetingLink && (
                            <p className="text-xs text-blue-600 mt-1">Meeting link available</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
