
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Clock, Award } from "lucide-react";

const WhyDonate = () => {
  const reasons = [
    {
      icon: Heart,
      title: "Save Lives",
      description: "One donation can save up to 3 lives. Your blood helps accident victims, surgery patients, and those battling illness.",
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Be part of a giving community. Your donation directly impacts your local hospitals and neighbors in need.",
    },
    {
      icon: Clock,
      title: "Quick & Easy",
      description: "The donation process takes only about an hour from check-in to refreshments, with the actual donation taking just 10 minutes.",
    },
    {
      icon: Award,
      title: "Health Benefits",
      description: "Regular donors receive free mini health check-ups and may have reduced risk of heart disease and cancer.",
    },
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blood">Why Donate Blood?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Your donation makes a bigger impact than you might realize.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <reason.icon className="h-6 w-6 text-blood" />
                </div>
                <CardTitle className="text-xl font-semibold">{reason.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{reason.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyDonate;
