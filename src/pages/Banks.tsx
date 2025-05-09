
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone, Clock, Calendar, X } from "lucide-react";
import { useState, useEffect } from "react";
import GoogleMap from "@/components/GoogleMap";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Banks = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default center of India
  const [markers, setMarkers] = useState<Array<any>>([]);
  const [filteredBanks, setFilteredBanks] = useState<typeof indianBanks>([]);
  
  // Scheduling state
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for Indian blood banks
  const indianBanks = [
    {
      id: 1,
      name: "Apollo Blood Bank",
      address: "Jubilee Hills, Hyderabad, Telangana 500033",
      phone: "(040) 2360-7777",
      hours: "Mon-Sat: 8AM-6PM, Sun: 9AM-2PM",
      distance: "1.2 km",
      position: { lat: 17.4256, lng: 78.4535 },
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
      name: "Max Healthcare Blood Bank",
      address: "Saket, New Delhi, Delhi 110017",
      phone: "(011) 2651-5050",
      hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-4PM",
      distance: "2.5 km",
      position: { lat: 28.5274, lng: 77.2159 },
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
      name: "Tata Memorial Blood Bank",
      address: "Parel, Mumbai, Maharashtra 400012",
      phone: "(022) 2417-7000",
      hours: "Mon-Fri: 8:30AM-5PM, Sat: 8:30AM-2PM, Sun: Closed",
      distance: "3.7 km",
      position: { lat: 18.9987, lng: 72.8282 },
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
      name: "Fortis Blood Donation Centre",
      address: "Bannerghatta Road, Bengaluru, Karnataka 560076",
      phone: "(080) 4969-4969",
      hours: "Mon-Sun: 24 Hours",
      distance: "4.1 km",
      position: { lat: 12.8988, lng: 77.5990 },
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

  useEffect(() => {
    // Set initial filtered banks
    setFilteredBanks(indianBanks);
    
    // Set up map markers
    const bankMarkers = indianBanks.map((bank) => ({
      position: bank.position,
      title: bank.name,
      info: `${bank.address}<br>Phone: ${bank.phone}`,
    }));
    setMarkers(bankMarkers);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredBanks(indianBanks);
      return;
    }

    const filtered = indianBanks.filter(
      (bank) =>
        bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredBanks(filtered.length > 0 ? filtered : []);
    
    if (filtered.length > 0) {
      // Center map on first result
      setMapCenter(filtered[0].position);
      toast.success(`Found ${filtered.length} blood banks matching "${searchQuery}"`);
    } else {
      toast.error(`No blood banks found matching "${searchQuery}"`);
    }
  };

  const handleCardClick = (bank: any) => {
    setMapCenter(bank.position);
  };
  
  const openScheduleModal = (bank: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!user && !authLoading) {
      toast.error("You must be logged in to schedule a donation");
      navigate("/login");
      return;
    }
    
    setSelectedBank(bank);
    setIsScheduleOpen(true);
  };
  
  const closeScheduleModal = () => {
    setIsScheduleOpen(false);
    setSelectedBank(null);
  };
  
  const handleScheduleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to schedule an appointment");
      navigate("/login");
      return;
    }
    
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    if (!selectedBank) {
      toast.error("No blood bank selected");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format the date as YYYY-MM-DD for database storage
      const formattedDate = format(date, "yyyy-MM-dd");
      
      const { error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          date: formattedDate,
          time: time,
          location: selectedBank.name,
          status: "Confirmed"
        });
      
      if (error) throw error;
      
      toast.success("Donation appointment scheduled successfully");
      
      // Close modal
      closeScheduleModal();
      
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error("Failed to schedule appointment");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGetDirections = (bank: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    // Open Google Maps directions in a new tab
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${bank.position.lat},${bank.position.lng}&destination_place_id=${bank.name}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Blood Banks in India</h1>
          <p className="mt-4 text-xl text-gray-500">
            Locate blood banks, check their inventory, and schedule appointments
          </p>
        </div>
        
        <div className="mb-8">
          <div className="h-[400px] rounded-lg overflow-hidden shadow-md mb-8">
            <GoogleMap 
              center={mapCenter} 
              zoom={12}
              markers={markers}
              height="400px"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input 
                placeholder="Enter location or blood bank name" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Button className="bg-blood hover:bg-blood-hover" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" /> Find Banks
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBanks.length > 0 ? (
            filteredBanks.map((bank) => (
              <Card 
                key={bank.id} 
                className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCardClick(bank)}
              >
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
                    <Button 
                      className="flex-1 bg-blood hover:bg-blood-hover"
                      onClick={(e) => openScheduleModal(bank, e)}
                    >
                      Schedule Donation
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-blood text-blood hover:bg-blood hover:text-white"
                      onClick={(e) => handleGetDirections(bank, e)}
                    >
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-500">No blood banks found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Schedule Donation Modal */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-blood">Schedule Blood Donation</DialogTitle>
            <DialogDescription>
              {selectedBank ? `at ${selectedBank.name}` : 'Select a date and time for your donation.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleDonation}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {date ? format(date, "PPP") : "Select a date"}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Please arrive 15 minutes before your scheduled time. Make sure you're well-hydrated and have had a proper meal before donating.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeScheduleModal} type="button">
                Cancel
              </Button>
              <Button 
                className="bg-blood hover:bg-blood-hover" 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Donation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Banks;
