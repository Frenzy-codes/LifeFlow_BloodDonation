
import { supabase } from "@/integrations/supabase/client";
import type { FeedbackFormValues } from "@/schemas/feedbackSchema";

export const submitFeedback = async (data: FeedbackFormValues, userId: string | undefined) => {
  // Using type assertion to fix type error
  const { error } = await supabase
    .from("feedback")
    .insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      category: data.category,
      message: data.message,
      user_id: userId || null,
    } as any);

  if (error) throw error;
  
  return { success: true };
};
