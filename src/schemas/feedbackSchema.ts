
import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  message: z.string().min(10, { message: "Feedback message must be at least 10 characters" }),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
