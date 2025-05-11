
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  contactNumber: z.string().min(10, {
    message: "Please enter a valid contact number.",
  }),
  bloodType: z.string({
    required_error: "Please select a blood type.",
  }),
  unitsNeeded: z.string().min(1, {
    message: "Please enter the number of units needed.",
  }),
  hospital: z.string().min(2, {
    message: "Hospital name must be at least 2 characters.",
  }),
  urgency: z.string({
    required_error: "Please select urgency level.",
  }),
  isSubscription: z.boolean().default(false),
  subscriptionFrequency: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const RequestBloodForm = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user && !authLoading) {
      toast.error("Please log in to request blood");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      unitsNeeded: "1",
      hospital: "",
      isSubscription: false,
      additionalInfo: "",
    },
  });

  // Watch for subscription checkbox changes
  const isSubscription = form.watch("isSubscription");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("You must be logged in to submit a request");
      return;
    }
    
    try {
      // Using type assertion to fix type error
      const { error } = await supabase
        .from("blood_requests")
        .insert({
          user_id: user.id,
          full_name: values.fullName,
          contact_number: values.contactNumber,
          blood_type: values.bloodType,
          units_needed: parseInt(values.unitsNeeded),
          hospital: values.hospital,
          urgency: values.urgency,
          is_subscription: values.isSubscription,
          subscription_frequency: values.subscriptionFrequency,
          additional_info: values.additionalInfo,
          status: "Pending"
        } as any);
      
      if (error) throw error;
      
      toast.success("Blood request submitted successfully!", {
        description: values.isSubscription 
          ? "We've registered your recurring blood need." 
          : "We will notify matching donors about your request.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting blood request:", error);
      toast.error("Failed to submit blood request");
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl text-blood font-semibold">Request Blood</CardTitle>
        <CardDescription>Fill out this form to request blood for a patient</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient/Requestor Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type Needed</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitsNeeded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units Needed</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
                    <FormDescription>
                      1 unit ≈ 350-450 ml of blood
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">Critical (Within Hours)</SelectItem>
                        <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
                        <SelectItem value="standard">Standard (2-3 days)</SelectItem>
                        <SelectItem value="scheduled">Scheduled Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hospital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital/Medical Facility</FormLabel>
                  <FormControl>
                    <Input placeholder="City General Hospital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subscription Options */}
            <div className="bg-gray-50 p-4 rounded-md border">
              <FormField
                control={form.control}
                name="isSubscription"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>This is a recurring blood need</FormLabel>
                      <FormDescription>
                        For patients who need regular transfusions (thalassemia, hemophilia, etc.)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {isSubscription && (
                <FormField
                  control={form.control}
                  name="subscriptionFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly (Every 3 months)</SelectItem>
                          <SelectItem value="semi-annual">Semi-Annually (Every 6 months)</SelectItem>
                          <SelectItem value="custom">Custom (Specify in additional info)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        We'll organize regular donations according to this schedule
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={isSubscription 
                        ? "Any details about the recurring blood need, specific dates, or special requirements..."
                        : "Any additional details that might be relevant..."}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-blood hover:bg-blood-hover">
              Submit Blood Request
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-gray-500 border-t pt-4">
        <p>
          All requests are verified before being sent to potential donors. For emergency situations,
          please contact your local hospital directly.
        </p>
      </CardFooter>
    </Card>
  );
};

export default RequestBloodForm;
