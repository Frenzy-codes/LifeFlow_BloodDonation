
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarPlus, MapPin, Hospital, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const formSchema = z.object({
  campName: z.string().min(3, {
    message: "Camp name must be at least 3 characters.",
  }),
  organizer: z.string().min(2, {
    message: "Organizer name must be at least 2 characters.",
  }),
  location: z.string().min(5, {
    message: "Please provide a detailed location.",
  }),
  date: z.string().refine(val => !!val, {
    message: "Please select a date for the camp.",
  }),
  startTime: z.string().refine(val => !!val, {
    message: "Please select a start time for the camp.",
  }),
  endTime: z.string().refine(val => !!val, {
    message: "Please select an end time for the camp.",
  }),
  contactNumber: z.string().min(10, {
    message: "Please enter a valid contact number.",
  }),
  description: z.string().min(20, {
    message: "Please provide a description of at least 20 characters.",
  }),
  requirements: z.string().optional(),
});

const HostCamp = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campName: "",
      organizer: "",
      location: "",
      date: "",
      startTime: "",
      endTime: "",
      contactNumber: "",
      description: "",
      requirements: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to host a blood donation camp");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const campData = {
        name: values.campName,
        organizer: values.organizer,
        location: values.location,
        date: values.date,
        start_time: values.startTime,
        end_time: values.endTime,
        contact_number: values.contactNumber,
        description: values.description,
        requirements: values.requirements || "",
        user_id: user.id,
        status: "pending",
      };

      const { error: insertError } = await supabase.from("blood_donation_camps").insert(campData);

      if (insertError) throw insertError;

      toast.success("Blood donation camp submitted for approval!");
      form.reset();
    } catch (err: any) {
      setError(err.message || "Failed to submit blood donation camp");
      toast.error("Failed to submit blood donation camp");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blood font-semibold">Host a Blood Donation Camp</CardTitle>
              <CardDescription>
                Fill in the details below to organize a blood donation camp in your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!user && (
                <Alert variant="warning" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You must be logged in to host a blood donation camp.{" "}
                    <a href="/login" className="font-medium underline">Log in</a> or{" "}
                    <a href="/register" className="font-medium underline">register</a> to continue.
                  </AlertDescription>
                </Alert>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="campName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Camp Name</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Hospital className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Community Blood Drive" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organizer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Organization" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <CalendarPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide details about your blood donation camp..."
                            className="resize-none min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any specific requirements or things donors should know..."
                            className="resize-none min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-blood hover:bg-blood-hover"
                    disabled={isSubmitting || !user}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Camp for Approval"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground">
              All blood donation camps require approval before they are listed publicly
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Why Host a Blood Donation Camp?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md overflow-hidden">
                <AspectRatio ratio={16/9}>
                  <img 
                    src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Blood donation" 
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
              <p>Hosting a blood donation camp in your community can save countless lives. Just one donation can help up to three people in need.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Engage your community in a meaningful cause</li>
                <li>Provide easy access to donation for willing donors</li>
                <li>Help maintain local blood supplies</li>
                <li>Raise awareness about blood donation</li>
                <li>Build goodwill for your organization</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>What We Provide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Once your camp is approved:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Listing on our platform for visibility</li>
                <li>Coordination with medical professionals</li>
                <li>Necessary equipment and supplies</li>
                <li>Promotional materials</li>
                <li>Online registration for donors</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HostCamp;
