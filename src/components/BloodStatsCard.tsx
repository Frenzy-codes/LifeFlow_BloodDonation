
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

interface BloodInventory {
  type: BloodType;
  stock: number;
  capacity: number;
}

const BloodStatsCard = () => {
  // Mock data - in a real app, this would come from an API
  const bloodInventory: BloodInventory[] = [
    { type: "A+", stock: 78, capacity: 100 },
    { type: "A-", stock: 45, capacity: 100 },
    { type: "B+", stock: 56, capacity: 100 },
    { type: "B-", stock: 23, capacity: 100 },
    { type: "AB+", stock: 12, capacity: 100 },
    { type: "AB-", stock: 8, capacity: 100 },
    { type: "O+", stock: 34, capacity: 100 },
    { type: "O-", stock: 12, capacity: 100 },
  ];

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl text-blood font-semibold">Current Blood Inventory</CardTitle>
        <CardDescription>Real-time blood stock levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bloodInventory.map((item) => {
            const percentage = Math.round((item.stock / item.capacity) * 100);
            return (
              <div key={item.type} className="flex flex-col space-y-2 p-2 border rounded-md">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{item.type}</span>
                  <span className={`text-sm ${percentage < 30 ? 'text-red-500' : percentage < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {item.stock} units
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2" 
                  indicatorClassName={getProgressColor(percentage)}
                />
                <div className="text-xs text-gray-500 text-right">
                  {percentage}% of capacity
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodStatsCard;
