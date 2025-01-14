import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AuthFormData, authFormSchema, AuthMode } from "@/types/auth";

export const useAuthForm = (mode: AuthMode) => {
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(data.email, data.password);
      } else {
        await signUp(data.email, data.password);
        navigate('/email-confirmation');
        return;
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      if (error.message.includes("Email not confirmed")) {
        toast({
          title: "Email Not Confirmed",
          description: "Please check your email and confirm your account before signing in.",
          variant: "destructive",
        });
        navigate('/email-confirmation');
      } else {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    onSubmit: form.handleSubmit(onSubmit),
  };
};