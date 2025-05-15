
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const Donors = () => {
  const [bloodType, setBloodType] = useState("");
  const [location, setLocation] = useState("");
  const [filteredDonors, setFilteredDonors] = useState<any[]>([]);

  // Indian donor data
  const indianDonors = [
    {
      id: 1,
      name: "Rajesh Kumar",
      bloodType: "O+",
      location: "Mumbai, Maharashtra",
      lastDonation: "3 months ago",
      donationCount: 12,
      available: true,
    },
    {
      id: 2,
      name: "Priya Sharma",
      bloodType: "AB-",
      location: "Delhi, NCR",
      lastDonation: "6 months ago",
      donationCount: 8,
      available: true,
    },
    {
      id: 3,
      name: "Amit Patel",
      bloodType: "A+",
      location: "Ahmedabad, Gujarat",
      lastDonation: "1 month ago",
      donationCount: 20,
      available: false,
    },
    {
      id: 4,
      name: "Sunita Reddy",
      bloodType: "B+",
      location: "Bangalore, Karnataka",
      lastDonation: "2 months ago",
      donationCount: 15,
      available: true,
    },
    {
      id: 5,
      name: "Karthik Iyer",
      bloodType: "O-",
      location: "Chennai, Tamil Nadu",
      lastDonation: "1 year ago",
      donationCount: 5,
      available: true,
    },
    {
      id: 6,
      name: "Ananya Desai",
      bloodType: "A-",
      location: "Pune, Maharashtra",
      lastDonation: "4 months ago",
      donationCount: 10,
      available: true,
    },
  ];

  // Initialize filteredDonors with all donors when component loads
  useEffect(() => {
    setFilteredDonors(indianDonors);
  }, []);

  // Search function
  const handleSearch = () => {
    let results = [...indianDonors];
    
    // Filter by blood type if selected
    if (bloodType) {
      results = results.filter(donor => donor.bloodType === bloodType);
    }
    
    // Filter by location if entered (case insensitive partial match)
    if (location) {
      results = results.filter(donor => 
        donor.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    setFilteredDonors(results);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Find Blood Donors</h1>
          <p className="mt-4 text-xl text-gray-500">
            Search for compatible donors in your area
          </p>
        </div>
        
        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blood font-semibold">Search Donors</CardTitle>
            <CardDescription>Filter by blood type and location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input 
                  placeholder="Enter location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button className="bg-blood hover:bg-blood-hover" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.length > 0 ? (
            filteredDonors.map((donor) => (
              <Card key={donor.id} className={`shadow-md hover:shadow-lg transition-shadow ${!donor.available && 'opacity-60'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">{donor.name}</CardTitle>
                    <span className="text-lg font-bold px-3 py-1 bg-red-100 text-blood rounded-full">
                      {donor.bloodType}
                    </span>
                  </div>
                  <CardDescription>{donor.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Donation:</span>
                      <span className="font-medium">{donor.lastDonation}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Donations:</span>
                      <span className="font-medium">{donor.donationCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium ${donor.available ? 'text-green-600' : 'text-red-600'}`}>
                        {donor.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant={donor.available ? "default" : "outline"}
                      disabled={!donor.available}
                    >
                      {donor.available ? 'Contact Donor' : 'Currently Unavailable'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8">
              <h3 className="text-xl font-medium text-gray-700">No donors match your search criteria</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search for a different blood type</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donors;
