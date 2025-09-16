"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NavigationHeader } from "@/components/navigation-header"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { MapPin, Phone, Clock, Star, Navigation, Search, Filter, ShoppingCart } from "lucide-react"

interface Pharmacy {
  id: string
  name: string
  address: string
  distance: number
  rating: number
  phone: string
  hours: string
  isOpen: boolean
  lat: number
  lng: number
  services: string[]
  hasDelivery: boolean
  estimatedDeliveryTime?: string
}

export default function PharmacyPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchLocation, setSearchLocation] = useState("")
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null)
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance")
  const [filterOpen, setFilterOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    {
      id: "1",
      name: "Apollo Pharmacy",
      address: "123 Main Street, Downtown",
      distance: 0.5,
      rating: 4.5,
      phone: "+91 9876543210",
      hours: "24/7",
      isOpen: true,
      lat: 28.6139,
      lng: 77.209,
      services: ["Prescription", "OTC Medicines", "Health Checkup", "Home Delivery"],
      hasDelivery: true,
      estimatedDeliveryTime: "30-45 mins",
    },
    {
      id: "2",
      name: "MedPlus",
      address: "456 Park Avenue, Central",
      distance: 1.2,
      rating: 4.3,
      phone: "+91 9876543211",
      hours: "8 AM - 10 PM",
      isOpen: true,
      lat: 28.6129,
      lng: 77.2295,
      services: ["Prescription", "OTC Medicines", "Medical Equipment"],
      hasDelivery: true,
      estimatedDeliveryTime: "45-60 mins",
    },
    {
      id: "3",
      name: "Wellness Pharmacy",
      address: "789 Health Street, Medical District",
      distance: 2.1,
      rating: 4.7,
      phone: "+91 9876543212",
      hours: "9 AM - 9 PM",
      isOpen: false,
      lat: 28.6219,
      lng: 77.2419,
      services: ["Prescription", "OTC Medicines", "Wellness Products", "Consultation"],
      hasDelivery: false,
    },
    {
      id: "4",
      name: "Care Pharmacy",
      address: "321 Medicine Lane, Hospital Area",
      distance: 2.8,
      rating: 4.2,
      phone: "+91 9876543213",
      hours: "7 AM - 11 PM",
      isOpen: true,
      lat: 28.6304,
      lng: 77.2177,
      services: ["Prescription", "OTC Medicines", "Emergency Medicines"],
      hasDelivery: true,
      estimatedDeliveryTime: "60-90 mins",
    },
  ])

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setSearchLocation("Current Location")

          const updatedPharmacies = pharmacies.map((pharmacy) => {
            // Calculate approximate distance using Haversine formula (simplified)
            const R = 6371 // Earth's radius in kilometers
            const dLat = ((pharmacy.lat - latitude) * Math.PI) / 180
            const dLng = ((pharmacy.lng - longitude) * Math.PI) / 180
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((latitude * Math.PI) / 180) *
                Math.cos((pharmacy.lat * Math.PI) / 180) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            const distance = R * c

            return {
              ...pharmacy,
              distance: Math.max(0.1, distance), // Ensure minimum distance of 0.1km
            }
          })
          setPharmacies(updatedPharmacies)
          setIsLoadingLocation(false)

          console.log("[] Location updated successfully:", { latitude, longitude })
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)

          let errorMessage = "Unable to get your location. "
          let fallbackAction = ""

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Location access was denied. "
              fallbackAction =
                "Please enable location permissions in your browser settings or enter your location manually."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable. "
              fallbackAction = "Please check your internet connection or enter your location manually."
              break
            case error.TIMEOUT:
              errorMessage += "Location request timed out. "
              fallbackAction = "Please try again or enter your location manually."
              break
            default:
              errorMessage += "An unknown error occurred. "
              fallbackAction = "Please enter your location manually."
              break
          }

          // Show user-friendly error with fallback options
          if (
            confirm(errorMessage + fallbackAction + "\n\nWould you like to search by entering your area name instead?")
          ) {
            // Focus on search input for manual entry
            const searchInput = document.querySelector('input[placeholder*="location"]') as HTMLInputElement
            if (searchInput) {
              searchInput.focus()
              searchInput.placeholder = "Enter your area, city, or pincode..."
            }
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 second timeout
          maximumAge: 300000, // Accept cached position up to 5 minutes old
        },
      )
    } else {
      setIsLoadingLocation(false)
      alert("Geolocation is not supported by this browser. Please enter your location manually.")
    }
  }

  const sortedPharmacies = [...pharmacies].sort((a, b) => {
    if (sortBy === "distance") {
      return a.distance - b.distance
    } else {
      return b.rating - a.rating
    }
  })

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  const handleDirections = (pharmacy: Pharmacy) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`
    window.open(url, "_blank")
  }

  const handleOrder = (pharmacy: Pharmacy) => {
    alert(`Order functionality would redirect to ${pharmacy.name}'s online ordering system`)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#1a365d] to-[#2d3748]">
      <NavigationHeader showBackButton={true} />

      {/* Page Title */}
      <div className="text-center py-6">
        <div className="inline-block bg-[#2ecc71] px-8 py-3 rounded-full">
          <h2 className="text-2xl font-bold text-black tracking-wider">PHARMACY LOCATOR</h2>
        </div>
        <p className="text-white/70 mt-2">Find nearby pharmacies, {user.name}</p>
        {userLocation && <p className="text-white/50 text-sm mt-1">📍 Using your current location</p>}
      </div>

      {/* Search Section */}
      <div className="px-6 mb-6">
        <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter your location or pincode..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      // Simulate search functionality
                      console.log("[] Searching for pharmacies near:", searchLocation)
                      if (searchLocation.trim()) {
                        // Update pharmacies based on search (demo functionality)
                        const searchResults = pharmacies.map((pharmacy) => ({
                          ...pharmacy,
                          distance: Math.random() * 3 + 0.2, // Random distance for demo
                        }))
                        setPharmacies(searchResults)
                      }
                    }
                  }}
                />
              </div>
              <Button
                className="bg-[#2ecc71] hover:bg-[#27ae60] text-white"
                onClick={() => {
                  console.log("[] Manual search triggered for:", searchLocation)
                  if (searchLocation.trim()) {
                    // Simulate search results based on entered location
                    const searchResults = pharmacies.map((pharmacy) => ({
                      ...pharmacy,
                      distance: Math.random() * 4 + 0.1,
                    }))
                    setPharmacies(searchResults)
                  } else {
                    alert("Please enter a location to search for nearby pharmacies.")
                  }
                }}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                className="border-[#2ecc71] text-[#2ecc71] hover:bg-[#2ecc71] hover:text-white bg-transparent"
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
              >
                <Navigation className="h-4 w-4 mr-2" />
                {isLoadingLocation ? "Getting..." : "Use GPS"}
              </Button>
            </div>

            {!userLocation && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Allow location access for accurate nearby pharmacy results, or manually enter
                  your area/pincode above.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "distance" | "rating")}
                    className="text-sm border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="distance">Distance</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)} className="text-sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                </Button>
              </div>
              <span className="text-sm text-gray-600">{pharmacies.length} pharmacies found</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Pharmacy List */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {sortedPharmacies.map((pharmacy, index) => (
            <Card
              key={pharmacy.id}
              className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{pharmacy.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pharmacy.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pharmacy.isOpen ? "Open" : "Closed"}
                      </span>
                      {pharmacy.hasDelivery && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Delivery Available
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{pharmacy.address}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{pharmacy.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{pharmacy.hours}</span>
                      </div>
                      <div className="flex items-center">
                        <Navigation className="h-4 w-4 mr-1" />
                        <span>{pharmacy.distance.toFixed(1)} km</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {pharmacy.services.map((service, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {service}
                        </span>
                      ))}
                    </div>

                    {pharmacy.hasDelivery && pharmacy.estimatedDeliveryTime && (
                      <div className="flex items-center text-sm text-blue-600 mb-3">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        <span>Delivery in {pharmacy.estimatedDeliveryTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">{pharmacy.phone}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#2ecc71] text-[#2ecc71] hover:bg-[#2ecc71] hover:text-white bg-transparent"
                      onClick={() => handleCall(pharmacy.phone)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#2ecc71] hover:bg-[#27ae60] text-white"
                      onClick={() => handleDirections(pharmacy)}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                    {pharmacy.hasDelivery && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white bg-transparent"
                        onClick={() => handleOrder(pharmacy)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Map Section */}
      <div className="px-6 pb-8">
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Map View</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Showing {pharmacies.length} nearby pharmacies</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-gray-300/30"></div>
                  ))}
                </div>
              </div>

              {/* Pharmacy markers */}
              <div className="absolute top-4 left-8 bg-red-500 text-white p-1 rounded-full text-xs">
                <MapPin className="h-3 w-3" />
              </div>
              <div className="absolute top-12 right-12 bg-green-500 text-white p-1 rounded-full text-xs">
                <MapPin className="h-3 w-3" />
              </div>
              <div className="absolute bottom-8 left-16 bg-blue-500 text-white p-1 rounded-full text-xs">
                <MapPin className="h-3 w-3" />
              </div>
              <div className="absolute bottom-16 right-8 bg-purple-500 text-white p-1 rounded-full text-xs">
                <MapPin className="h-3 w-3" />
              </div>

              {/* User location marker */}
              {userLocation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full">
                  <Navigation className="h-4 w-4" />
                </div>
              )}

              <div className="text-center text-gray-600 z-10">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-[#2ecc71]" />
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm">Click on markers to view pharmacy details</p>
                {!userLocation && <p className="text-xs mt-2 text-blue-600">Enable GPS for accurate positioning</p>}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Open Pharmacy</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Closed Pharmacy</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
