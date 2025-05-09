
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleMap from "./GoogleMap";
import { toast } from "sonner";

// Indian blood donation centers data
const indianCenters = [
  {
    id: 1,
    name: "Sahyadri Blood Bank",
    address: "Karve Road, Deccan Gymkhana, Pune, Maharashtra",
    distance: "1.2 km",
    availability: "High",
    position: { lat: 18.5204, lng: 73.8567 },
  },
  {
    id: 2,
    name: "Jankalyan Blood Bank",
    address: "MG Road, Camp Area, Pune, Maharashtra",
    distance: "2.5 km",
    availability: "Medium",
    position: { lat: 18.5138, lng: 73.8750 },
  },
  {
    id: 3,
    name: "AIIMS Blood Center",
    address: "Saket, New Delhi, Delhi",
    distance: "3.7 km",
    availability: "Low",
    position: { lat: 28.5355, lng: 77.2100 },
  },
];

const BloodLocationMap = () => {
  const [location, setLocation] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 }); // Default to Pune
  const [markers, setMarkers] = useState<Array<any>>([]);
  const [filteredCenters, setFilteredCenters] = useState(indianCenters);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Initialize markers based on blood centers
    const centerMarkers = indianCenters.map((center) => ({
      position: center.position,
      title: center.name,
      info: `${center.address}<br>Blood Availability: ${center.availability}`,
    }));
    setMarkers(centerMarkers);
  }, []);

  const handleSearch = () => {
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    // In a real app, you would use the Geocoding API to convert the location to coordinates
    // For this demo, we'll just simulate finding the centers
    toast.success(`Searching blood banks near ${location}`);
    
    // Simulate finding centers near the searched location
    // In a real app, this would filter based on actual geocoded location
    const filtered = indianCenters.filter((center) => 
      center.name.toLowerCase().includes(location.toLowerCase()) || 
      center.address.toLowerCase().includes(location.toLowerCase())
    );
    
    setFilteredCenters(filtered.length > 0 ? filtered : indianCenters);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
          toast.success("Located you successfully!");
        },
        () => {
          toast.error("Unable to retrieve your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Card className="w-full lg:w-1/2 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-blood font-semibold">Find Blood Banks Near You</CardTitle>
          <CardDescription>Locate the closest donation centers in India</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="flex flex-col md:flex-row w-full items-center space-y-2 md:space-y-0 md:space-x-2 mb-6">
            <Input
              type="text"
              placeholder="Enter your location in India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <div className="flex space-x-2 w-full md:w-auto">
              <Button className="bg-blood hover:bg-blood-hover flex-1 md:flex-none" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none" onClick={getUserLocation}>
                <MapPin className="h-4 w-4 mr-2" /> Use My Location
              </Button>
            </div>
          </div>

          {/* Google Map */}
          <div className="w-full mb-6 rounded-md overflow-hidden">
            <GoogleMap 
              center={mapCenter} 
              zoom={12} 
              markers={markers}
              height="300px"
            />
          </div>

          {/* Location Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Nearby Blood Banks</h3>
            <div className="space-y-3">
              {filteredCenters.map((center) => (
                <div 
                  key={center.id} 
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setMapCenter(center.position)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{center.name}</h4>
                    <span className="text-sm text-gray-500">{center.distance}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{center.address}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      Blood Availability:
                      <span className={`ml-1 font-medium ${
                        center.availability === "High" 
                          ? "text-green-600" 
                          : center.availability === "Medium" 
                            ? "text-yellow-600" 
                            : "text-red-600"
                      }`}>
                        {center.availability}
                      </span>
                    </span>
                    <Button variant="outline" size="sm" className="text-blood border-blood hover:bg-blood hover:text-white">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full lg:w-1/2 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-blood font-semibold">Schedule an Appointment</CardTitle>
          <CardDescription>Reserve your donation slot at a convenient time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="text-gray-700 hover:bg-gray-100">Today</Button>
              <Button variant="outline" className="text-gray-700 hover:bg-gray-100">Tomorrow</Button>
              <Button variant="outline" className="text-gray-700 hover:bg-gray-100">This Week</Button>
              <Button variant="outline" className="text-gray-700 hover:bg-gray-100">Next Week</Button>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-md font-medium mb-3">Available Time Slots</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="text-gray-700">9:00 AM</Button>
                <Button variant="outline" size="sm" className="text-gray-700">10:00 AM</Button>
                <Button variant="outline" size="sm" className="text-blood border-blood">11:00 AM</Button>
                <Button variant="outline" size="sm" className="text-gray-700">1:00 PM</Button>
                <Button variant="outline" size="sm" className="text-gray-700">2:00 PM</Button>
                <Button variant="outline" size="sm" className="text-gray-700">3:00 PM</Button>
                <Button variant="outline" size="sm" className="text-gray-700">4:00 PM</Button>
                <Button variant="outline" size="sm" className="text-gray-700">5:00 PM</Button>
                <Button variant="outline" size="sm" className="text-gray-700">6:00 PM</Button>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-blood hover:bg-blood-hover">Book Appointment</Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                You'll receive a confirmation SMS after booking
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodLocationMap;
