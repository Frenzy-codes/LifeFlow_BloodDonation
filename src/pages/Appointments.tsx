
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  location: string;
  status: string;
  user_id: string;
}

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Mock data for available locations
  const locations = [
    { id: "loc1", name: "City General Hospital Blood Bank" },
    { id: "loc2", name: "Downtown Blood Donation Center" },
    { id: "loc3", name: "University Medical Blood Services" },
    { id: "loc4", name: "Central Blood Bank" },
  ];

  // Mock data for available time slots
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM"
  ];

  useEffect(() => {
    if (!user && !authLoading) {
      navigate("/login");
      return;
    }
    
    if (user) {
      fetchAppointments();
    }
  }, [user, authLoading, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: true });
      
      if (error) throw error;
      
      const upcoming: Appointment[] = [];
      const past: Appointment[] = [];
      
      data?.forEach(appointment => {
        const appointmentDate = new Date(appointment.date);
        if (appointmentDate >= today) {
          upcoming.push({
            ...appointment,
            date: appointmentDate
          });
        } else {
          past.push({
            ...appointment,
            date: appointmentDate
          });
        }
      });
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!date || !location || !time || !user) {
      toast.error("Please select date, location and time slot");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          date: date.toISOString(),
          time: time,
          location: location,
          status: "Confirmed"
        });
      
      if (error) throw error;
      
      toast.success("Appointment scheduled successfully!", {
        description: `Your appointment at ${location} on ${date.toDateString()} at ${time} has been confirmed.`,
      });
      
      // Reset form and refresh appointments
      setDate(undefined);
      setLocation("");
      setTime("");
      fetchAppointments();
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error("Failed to schedule appointment");
    }
  };

  const handleReschedule = async (appointmentId: string) => {
    toast.info("Reschedule functionality coming soon!");
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentId)
        .eq("user_id", user?.id);
      
      if (error) throw error;
      
      toast.success("Appointment cancelled successfully");
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authLoading || (loading && !upcomingAppointments.length && !pastAppointments.length)) {
    return (
      <div className="py-12 flex justify-center">
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Blood Donation Appointments</h1>
          <p className="mt-4 text-xl text-gray-500">
            Schedule a new appointment or manage your existing ones
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-blood font-semibold">Schedule New Appointment</CardTitle>
                <CardDescription>Select your preferred date, location and time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Select a date:</h3>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="border rounded-md"
                      disabled={(date) => {
                        // Disable past dates and Sundays
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || date.getDay() === 0;
                      }}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Select location:</h3>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.name}>
                              {loc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Select time slot:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <Button 
                            key={slot}
                            variant={time === slot ? "default" : "outline"} 
                            className={time === slot ? "bg-blood hover:bg-blood-hover" : ""}
                            onClick={() => setTime(slot)}
                            size="sm"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-blood hover:bg-blood-hover"
                  onClick={handleSchedule}
                  disabled={!date || !location || !time}
                >
                  Schedule Appointment
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-blood font-semibold">Your Appointments</CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upcoming" className="space-y-4 mt-4">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((apt) => (
                        <Card key={apt.id}>
                          <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{formatDate(apt.date)}</span>
                              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {apt.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">{apt.time}</div>
                            <div className="text-sm text-gray-600">{apt.location}</div>
                            <div className="pt-2 flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleReschedule(apt.id)}
                              >
                                Reschedule
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                onClick={() => handleCancel(apt.id)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No upcoming appointments.
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="past" className="space-y-4 mt-4">
                    {pastAppointments.length > 0 ? (
                      pastAppointments.map((apt) => (
                        <Card key={apt.id}>
                          <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{formatDate(apt.date)}</span>
                              <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                {apt.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">{apt.time}</div>
                            <div className="text-sm text-gray-600">{apt.location}</div>
                            <div className="pt-2">
                              <Button variant="outline" size="sm" className="w-full">
                                View Certificate
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No past appointments.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
