import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const EmailConfirmation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent you a confirmation email. Please check your inbox and click the confirmation link to activate your account.
          </p>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or
          </p>
          <Button variant="link" className="text-blue-600 hover:text-blue-500" asChild>
            <Link to="/signup">try signing up again</Link>
          </Button>
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/signin">Return to Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;