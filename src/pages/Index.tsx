
import Hero from "@/components/Hero";
import WhyDonate from "@/components/WhyDonate";
import BloodStatsCard from "@/components/BloodStatsCard";
import BloodLocationMap from "@/components/BloodLocationMap";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Droplet, Calendar, Bell } from "lucide-react";

const Index = () => {
  // Testimonials data - in a real app, this would come from an API
  const testimonials = [
    {
      quote: "Donating blood is one of the most rewarding things I've ever done. It takes just an hour of my time but can save someone's life.",
      name: "Sarah Johnson",
      role: "Regular Donor",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    {
      quote: "After my accident, I needed multiple blood transfusions. I'm alive today because strangers decided to donate blood. Now I donate regularly to give back.",
      name: "Michael Chen",
      role: "Recipient & Donor",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    {
      quote: "LifeFlow made it incredibly easy to find blood donation centers near me and schedule appointments at times that work for my busy schedule.",
      name: "Priya Patel",
      role: "First-time Donor",
      image: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
  ];

  // Blood donation process steps
  const donationSteps = [
    {
      title: "Register",
      description: "Complete a registration form and short medical history questionnaire.",
      icon: UserPlus
    },
    {
      title: "Quick Health Check",
      description: "Staff will check your temperature, blood pressure, pulse, and hemoglobin levels.",
      icon: Activity
    },
    {
      title: "Donation",
      description: "The actual donation takes only 8-10 minutes, during which you'll be seated comfortably.",
      icon: Droplet
    },
    {
      title: "Refreshments",
      description: "Enjoy light refreshments while resting for 15 minutes before leaving.",
      icon: Coffee
    },
  ];

  return (
    <>
      <Hero />
      
      <WhyDonate />
      
      {/* Blood Inventory Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Current Blood Inventory</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              See real-time blood supply levels and where your donation is needed most.
            </p>
          </div>
          <BloodStatsCard />
        </div>
      </div>
      
      {/* Donation Process Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">The Donation Process</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Donating blood is a simple four-step process
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {donationSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-blood" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
                <div className="flex justify-center mt-4">
                  <div className="h-1 w-16 bg-blood rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Map and Appointment Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Find a Blood Bank Near You</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Locate the nearest donation center and schedule your appointment.
            </p>
          </div>
          <BloodLocationMap />
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blood py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blood-dark bg-opacity-30 p-8 md:p-12 rounded-xl">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Make a Difference?</h2>
              <p className="text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto">
                Your donation can save up to three lives. Join thousands of donors and schedule your appointment today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-white text-blood hover:bg-gray-100" asChild>
                  <Link to="/register">
                    <Droplet className="mr-2 h-5 w-5" />
                    Become a Donor
                  </Link>
                </Button>
                <Button size="lg" className="bg-blood-dark text-white hover:bg-blood-hover border border-white" asChild>
                  <Link to="/appointments">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Appointment
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-blood-dark" asChild>
                  <Link to="/request">
                    <Bell className="mr-2 h-5 w-5" />
                    Request Blood
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What People Are Saying</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Hear from donors and recipients who are part of the LifeFlow community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                <div className="flex-1">
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </div>
                <div className="mt-6 flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// Missing icon imports
import { UserPlus, Activity, Coffee } from "lucide-react";

export default Index;
