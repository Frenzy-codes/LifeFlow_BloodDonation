
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Appointment {
  id: string;
  date: string; // Store as string for database compatibility
  time: string;
  location: string;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
}

const Appointments = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingAppointments, setFetchingAppointments] = useState(true);
  
  // Indian blood donation centers
  const bloodBanks = [
    "Apollo Blood Bank, Hyderabad",
    "Max Healthcare Blood Bank, Delhi",
    "Tata Memorial Blood Bank, Mumbai",
    "Fortis Blood Donation Centre, Bengaluru",
    "AIIMS Blood Center, New Delhi",
    "Sahyadri Blood Bank, Pune",
    "Jankalyan Blood Bank, Pune",
    "Rotary Blood Bank, Chandigarh",
    "CMC Blood Bank, Vellore",
    "PGI Blood Bank, Lucknow"
  ];

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
      return;
    }
    
    if (user) {
      fetchAppointments();
    }
  }, [user, isLoading, navigate]);
  
  const fetchAppointments = async () => {
    if (!user) return;
    
    try {
      setFetchingAppointments(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Using type assertion to fix type error
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user?.id);
      
      if (error) throw error;
      
      if (data) {
        // Convert ISO date strings to Date objects for comparison
        const appointments = data as Appointment[];
        
        // Sort appointments by date
        appointments.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        
        setAppointments(appointments);
        
        // Filter upcoming and past appointments
        const upcoming: Appointment[] = [];
        const past: Appointment[] = [];
        
        appointments.forEach(appt => {
          const apptDate = new Date(appt.date);
          if (apptDate.getTime() >= today.getTime()) {
            upcoming.push(appt);
          } else {
            past.push(appt);
          }
        });
        
        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setFetchingAppointments(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    if (!location) {
      toast.error("Please select a blood bank");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format the date as YYYY-MM-DD for database storage
      const formattedDate = format(date, "yyyy-MM-dd");
      
      // Using type assertion to fix type error
      const { error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          date: formattedDate,
          time: time,
          location: location,
          status: "Confirmed"
        });
      
      if (error) throw error;
      
      toast.success("Appointment scheduled successfully");
      
      // Reset form
      setDate(new Date());
      setTime("09:00");
      setLocation("");
      
      // Refresh appointments
      fetchAppointments();
      
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error("Failed to schedule appointment");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentId);
      
      if (error) throw error;
      
      toast.success("Appointment cancelled successfully");
      
      // Refresh appointments
      fetchAppointments();
      
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  // Function to format the date string for display
  const formatAppointmentDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (isLoading || fetchingAppointments) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blood mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Blood Donation Appointments</h1>
          <p className="mt-4 text-xl text-gray-500">
            Schedule and manage your blood donation appointments
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Schedule Appointment Card */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-blood font-semibold">Schedule an Appointment</CardTitle>
              <CardDescription>Book your next blood donation</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex justify-between items-center"
                        >
                          {date ? format(date, "PPP") : "Pick a date"}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => {
                            const now = new Date();
                            const yesterday = new Date(now);
                            yesterday.setDate(yesterday.getDate() - 1);
                            return date < yesterday;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Select Time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Select Blood Bank</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodBanks.map((bank) => (
                          <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blood hover:bg-blood-hover"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Appointments List Card */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-blood font-semibold">Your Appointments</CardTitle>
              <CardDescription>View and manage your blood donation appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{appointment.location}</h3>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              {appointment.status}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <div className="flex items-center mb-1">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                              {formatAppointmentDate(appointment.date)}
                            </div>
                            <div className="flex items-center mb-1">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              {appointment.location}
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancel(appointment.id)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No upcoming appointments. Schedule one now!</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past">
                  {pastAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {pastAppointments.map((appointment) => (
                        <div key={appointment.id} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{appointment.location}</h3>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                              Completed
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <div className="flex items-center mb-1">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                              {formatAppointmentDate(appointment.date)}
                            </div>
                            <div className="flex items-center mb-1">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              {appointment.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No past appointments found.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
