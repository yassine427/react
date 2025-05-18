// src/components/auth/SignInForm.tsx (or wherever you place it)
"use client"; // This component needs client-side interactivity
import { getSession } from 'next-auth/react'; // ✅ add getSession
import Input from "@/components/form/input/InputField"; // Your Input component
import Label from "@/components/form/Label";           // Your Label component
import Button from "@/components/ui/button/Button";   // Your Button component
import { EyeCloseIcon, EyeIcon } from "@/icons";      // Your icons (Ensure these components accept className or style props if needed)
import Link from "next/link";
import React, { useState, FormEvent } from "react"; // Import FormEvent for event typing
import { signIn } from 'next-auth/react';             // Import the signIn function
import { useRouter } from 'next/navigation';        // Import useRouter for redirection

export default function SignInForm() {
  // State for password visibility - Type: boolean
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // --- State for form inputs, error messages, and loading status ---
  // Type: string for text inputs
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // Type: string for error message
  const [error, setError] = useState<string>('');
  // Type: boolean for loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter(); // useRouter hook from next/navigation

  // --- Handle form submission ---
  // Type the event parameter as React.FormEvent<HTMLFormElement>
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(
        result.error === 'CredentialsSignin'
          ? 'Invalid email or password.'
          : 'Login failed. Please try again.'
      );
    } else if (result?.ok) {
      // ✅ Wait for session to populate
      const session = await getSession();

      if (!session?.user) {
        setError("Login failed. Please try again.");
        return;
      }

      // ✅ Redirect based on role
      switch (session.user.role) {
        case 'admin':
          router.replace('/admin/medecins');
          break;
        case 'patient':
          router.replace('/');
          break;
        case 'medecin':
                    localStorage.setItem("medecin",session.user.email);

          router.replace('/medecinAdmin');
          break;
        default:
          router.replace('/');
          break;
      }
    } else {
      setError("An unexpected error occurred during login.");
    }
  } catch (err) {
    setIsLoading(false);
    console.error("Exception during sign-in call:", err);
    setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

  return (
    // Using the existing layout structure
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4 py-8">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            {/* Attach the submit handler to the form */}
            <form onSubmit={handleSubmit}>
              {/* Display error message if present */}
              {error && (
                 <p className="mb-4 text-center text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
                   {error}
                 </p>
              )}

              <div className="space-y-6">
                <div>
                  {/* Add htmlFor for accessibility */}
                  <Label htmlFor="email-signin">
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  {/* Bind Input to state */}
                  <Input
                    id="email-signin" // Unique ID
                    placeholder="info@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} // Type the event here toorequired // HTML5 validation
                    disabled={isLoading} // Disable when loading
                  />
                </div>
                <div>
                  {/* Add htmlFor for accessibility */}
                  <Label htmlFor="password-signin">
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    {/* Bind Input to state */}
                    <Input
                      id="password-signin" // Unique ID
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // Type the event here too
                      // HTML5 validation
                      disabled={isLoading} // Disable when loading
                    />
                    {/* Password visibility toggle */}
                    <span
                      onClick={() => !isLoading && setShowPassword(!showPassword)}
                      className={`absolute z-10 -translate-y-1/2 right-4 top-1/2 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      title={showPassword ? "Hide password" : "Show password"}
                      role="button" // Add role for accessibility
                      aria-pressed={showPassword} // Indicate state for screen readers
                    >
                      {showPassword ? (
                        <EyeIcon className="w-5 h-5 fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="w-5 h-5 fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  {/* Forgot password link */}
                  <Link
                    href="/reset-password" // Make sure this route exists
                    className={`text-sm hover:text-brand-600 dark:text-brand-400 ${isLoading ? 'pointer-events-none text-gray-400' : 'text-brand-500'}`}
                    aria-disabled={isLoading}
                    tabIndex={isLoading ? -1 : undefined} // Improve accessibility when disabled
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  {/* Submit button */}
                  <Button
                    type="submit" // Set type to submit
                    className="w-full"
                    size="sm"
                    disabled={isLoading} // Disable when loading
                  >
                    {isLoading ? 'Signing In...' : 'Sign in'} {/* Change text when loading */}
                  </Button>
                </div>
              </div>
            </form>

            {/* Link to Sign Up page */}
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup" // Make sure this route exists
                  className={`font-medium hover:text-brand-600 dark:text-brand-400 ${isLoading ? 'pointer-events-none text-gray-400' : 'text-brand-500'}`}
                  aria-disabled={isLoading}
                  tabIndex={isLoading ? -1 : undefined}
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

