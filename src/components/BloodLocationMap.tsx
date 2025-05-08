
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data for blood donation centers
const mockCenters = [
  {
    id: 1,
    name: "Community Blood Center",
    address: "123 Main St, Anytown, USA",
    distance: "1.2 miles",
    availability: "High",
  },
  {
    id: 2,
    name: "Regional Medical Blood Bank",
    address: "456 Oak Ave, Anytown, USA",
    distance: "2.5 miles",
    availability: "Medium",
  },
  {
    id: 3,
    name: "University Hospital Blood Services",
    address: "789 College Blvd, Anytown, USA",
    distance: "3.7 miles",
    availability: "Low",
  },
];

const BloodLocationMap = () => {
  const [location, setLocation] = useState("");

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Card className="w-full lg:w-1/2 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-blood font-semibold">Find Blood Banks Near You</CardTitle>
          <CardDescription>Locate the closest donation centers</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
            <Input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Button className="bg-blood hover:bg-blood-hover">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>

          {/* Map Placeholder - In a real app, this would be a Google Map */}
          <div className="w-full h-60 bg-gray-200 rounded-md flex items-center justify-center mb-6">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                Map loading... (In a real app, this would be an interactive Google Map)
              </p>
            </div>
          </div>

          {/* Location Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Nearby Blood Banks</h3>
            <div className="space-y-3">
              {mockCenters.map((center) => (
                <div key={center.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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
                You'll receive a confirmation email after booking
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodLocationMap;
