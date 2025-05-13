
import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const eligibilityQuestions = [
  {
    id: "age",
    question: "Are you between 18 and 65 years of age?",
    required: true
  },
  {
    id: "weight",
    question: "Do you weigh at least 45 kg (99 lbs)?",
    required: true
  },
  {
    id: "health",
    question: "Are you in good health and feeling well today?",
    required: true
  },
  {
    id: "meal",
    question: "Have you eaten in the last 4 hours?",
    required: true
  },
  {
    id: "medication",
    question: "Are you currently free from antibiotics or other medications for an infection?",
    required: true
  },
  {
    id: "pregnant",
    question: "For females: Are you not pregnant, and have not been pregnant in the last 6 months?",
    required: false
  },
  {
    id: "donation_history",
    question: "Has it been at least 3 months since your last blood donation?",
    required: true
  }
];

const EligibilityTest = () => {
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | null>>({});
  const [result, setResult] = useState<"eligible" | "not-eligible" | null>(null);
  
  const handleAnswerChange = (questionId: string, value: "yes" | "no") => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const checkEligibility = () => {
    // Check if all required questions are answered with "yes"
    const isEligible = eligibilityQuestions.every(question => {
      if (question.required) {
        return answers[question.id] === "yes";
      }
      return true;
    });
    
    setResult(isEligible ? "eligible" : "not-eligible");
  };
  
  const resetTest = () => {
    setAnswers({});
    setResult(null);
  };
  
  const allQuestionsAnswered = eligibilityQuestions
    .filter(q => q.required)
    .every(q => answers[q.id] !== undefined);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">Check Your Eligibility to Donate</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Blood Donation Eligibility Check</SheetTitle>
          <SheetDescription>
            Answer these questions to check if you're eligible to donate blood today.
          </SheetDescription>
        </SheetHeader>
        
        {result === null ? (
          <div className="space-y-6">
            {eligibilityQuestions.map((q) => (
              <div key={q.id} className="space-y-2">
                <p className="font-medium">{q.question}</p>
                <RadioGroup
                  value={answers[q.id] || ""}
                  onValueChange={(value) => handleAnswerChange(q.id, value as "yes" | "no")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`${q.id}-yes`} />
                    <Label htmlFor={`${q.id}-yes`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`${q.id}-no`} />
                    <Label htmlFor={`${q.id}-no`}>No</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
            
            <Button 
              onClick={checkEligibility} 
              disabled={!allQuestionsAnswered}
              className="w-full"
            >
              Check My Eligibility
            </Button>
          </div>
        ) : (
          <Card className={result === "eligible" ? "border-green-500" : "border-red-500"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result === "eligible" ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-green-700">You're Eligible to Donate!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <span className="text-red-700">You May Not Be Eligible</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result === "eligible" ? (
                <p>Based on your answers, you appear to be eligible to donate blood. Please proceed with the blood request form below.</p>
              ) : (
                <p>Based on your answers, you may not be eligible to donate blood at this time. Please consult with a healthcare professional or blood donation center for specific guidance.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={resetTest} variant="outline" className="w-full">
                Retake Test
              </Button>
            </CardFooter>
          </Card>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EligibilityTest;
