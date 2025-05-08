
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone, Clock } from "lucide-react";

const Banks = () => {
  // Mock data for blood banks
  const mockBanks = [
    {
      id: 1,
      name: "City General Hospital Blood Bank",
      address: "123 Medical Center Dr, New York, NY 10001",
      phone: "(212) 555-1234",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM, Sun: Closed",
      distance: "1.2 miles",
      availability: {
        "A+": "High",
        "A-": "Medium",
        "B+": "Low",
        "B-": "Critical",
        "AB+": "Medium",
        "AB-": "Critical",
        "O+": "High",
        "O-": "Medium",
      },
    },
    {
      id: 2,
      name: "Downtown Blood Donation Center",
      address: "456 Community Blvd, New York, NY 10002",
      phone: "(212) 555-5678",
      hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-4PM",
      distance: "2.5 miles",
      availability: {
        "A+": "High",
        "A-": "High",
        "B+": "Medium",
        "B-": "Medium",
        "AB+": "Low",
        "AB-": "Low",
        "O+": "Critical",
        "O-": "Critical",
      },
    },
    {
      id: 3,
      name: "University Medical Blood Services",
      address: "789 University Ave, New York, NY 10003",
      phone: "(212) 555-9012",
      hours: "Mon-Fri: 8:30AM-5PM, Sat-Sun: Closed",
      distance: "3.7 miles",
      availability: {
        "A+": "Medium",
        "A-": "Low",
        "B+": "High",
        "B-": "Medium",
        "AB+": "High",
        "AB-": "Medium",
        "O+": "Low",
        "O-": "Critical",
      },
    },
    {
      id: 4,
      name: "Central Blood Bank",
      address: "101 Main Street, New York, NY 10004",
      phone: "(212) 555-3456",
      hours: "Mon-Sun: 24 Hours",
      distance: "4.1 miles",
      availability: {
        "A+": "High",
        "A-": "Medium",
        "B+": "High",
        "B-": "High",
        "AB+": "Medium",
        "AB-": "Low",
        "O+": "Medium",
        "O-": "Medium",
      },
    },
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Blood Banks Near You</h1>
          <p className="mt-4 text-xl text-gray-500">
            Locate blood banks, check their inventory, and schedule appointments
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input placeholder="Enter your location" />
          </div>
          <Button className="bg-blood hover:bg-blood-hover">
            <Search className="h-4 w-4 mr-2" /> Find Banks
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockBanks.map((bank) => (
            <Card key={bank.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">{bank.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 inline" /> 
                  {bank.address} ({bank.distance})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" /> 
                  <span>{bank.phone}</span>
                </div>
                <div className="text-sm flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                  <span>{bank.hours}</span>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Blood Availability:</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(bank.availability).map(([type, level]) => (
                      <div key={type} className="text-center">
                        <div className="text-sm font-semibold">{type}</div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                          level === "High" 
                            ? "bg-green-100 text-green-800" 
                            : level === "Medium" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : level === "Low" 
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                        }`}>
                          {level}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1 bg-blood hover:bg-blood-hover">
                    Schedule Donation
                  </Button>
                  <Button variant="outline" className="flex-1 border-blood text-blood hover:bg-blood hover:text-white">
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banks;
