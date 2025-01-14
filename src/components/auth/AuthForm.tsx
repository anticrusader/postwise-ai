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
import { AuthMode } from "@/types/auth";
import { useAuthForm } from "@/hooks/useAuthForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthFormProps {
  mode: AuthMode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const { form, loading, onSubmit } = useAuthForm(mode);
  const { toast } = useToast();
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePasswordReset = async () => {
    try {
      setIsResetting(true);
      console.log('Reset password for:', resetEmail);
      console.log('Current origin:', window.location.origin);
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link.",
      });
      setResetEmail("");
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="email@example.com" 
                  type="email" 
                  {...field} 
                  disabled={loading}
                  onChange={(e) => field.onChange(e.target.value.trim())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="••••••••" 
                  type="password" 
                  {...field} 
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </span>
            </>
          ) : mode === "signin" ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </Button>

        {mode === "signin" && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Forgot your password?</h3>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value.trim())}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handlePasswordReset}
                disabled={isResetting || !resetEmail}
              >
                {isResetting ? "Sending Reset Link..." : "Reset Password"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}