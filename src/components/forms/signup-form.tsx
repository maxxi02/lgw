"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signupSchema } from "./form-schemas/schemas";

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps extends React.ComponentProps<"form"> {
  className?: string;
}

export function SignupForm({ className, ...props }: SignupFormProps) {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: SignupFormValues) {
    try {
      const { name, email, password, image } = values;
      await authClient.signUp.email(
        {
          email,
          password,
          name,
          image: image || undefined,
        },
        {
          onSuccess: () => {
            // setUserEmail(email);
            // setEmailSent(true);
            toast.success("Account Created", {
              description: "Please check your email to verify your account.",
              richColors: true,
            });
          },
          onError: async (err) => {
            if (err.error.status === 403) {
              toast.info("Alert", {
                description: "Please verify your email address.",
                richColors: true,
              });
              return;
            }
            if (err.error.status === 422) {
              toast.info("Alert", {
                description: "Email already exists. Please sign in.",
                richColors: true,
              });
              return;
            }
            toast.error("Error", {
              description: "Your account could not be created.",
              richColors: true,
            });
          },
        }
      );
    } catch (error) {
      toast.error("Error", {
        description: "An error occurred while creating your account.",
      });
      console.log((error as Error).message);
    }
  }

  // async function resendVerificationEmail() {
  //   if (!userEmail) return;

  //   setIsResending(true);
  //   try {
  //     await authClient.sendVerificationEmail({
  //       email: userEmail,
  //     });
  //     toast.success("Email Sent", {
  //       description: "Verification email has been resent.",
  //       richColors: true,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Error", {
  //       description: "Failed to resend verification email.",
  //       richColors: true,
  //     });
  //   } finally {
  //     setIsResending(false);
  //   }
  // }

  // Show email verification success screen
  // if (emailSent) {
  //   return (
  //     <div className={cn("flex flex-col gap-6 text-center", className)}>
  //       <div className="flex flex-col items-center gap-4">
  //         <div className="rounded-full bg-green-100 p-3">
  //           <Mail className="h-8 w-8 text-green-600" />
  //         </div>
  //         <div className="space-y-2">
  //           <h1 className="text-2xl font-bold">Check your email</h1>
  //           <p className="text-muted-foreground text-sm max-w-sm">
  //             We&#39;ve sent a verification link to <strong>{userEmail}</strong>
  //           </p>
  //         </div>
  //       </div>

  //       <div className="space-y-4">
  //         <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
  //           <div className="flex items-center gap-2 mb-2">
  //             <CheckCircle className="h-4 w-4" />
  //             <span className="font-medium">Next steps:</span>
  //           </div>
  //           <ol className="text-left space-y-1 ml-6 list-decimal">
  //             <li>Check your email inbox</li>
  //             <li>Click the verification link</li>
  //             <li>Return here to sign in</li>
  //           </ol>
  //         </div>

  //         <div className="space-y-3">
  //           <Button
  //             onClick={resendVerificationEmail}
  //             disabled={isResending}
  //             variant="outline"
  //             className="w-full"
  //           >
  //             {isResending ? (
  //               <Loader2 className="animate-spin mr-2 h-4 w-4" />
  //             ) : (
  //               <Mail className="mr-2 h-4 w-4" />
  //             )}
  //             Resend verification email
  //           </Button>

  //           <Button onClick={() => push("/signin")} className="w-full">
  //             Continue to Sign In
  //           </Button>
  //         </div>
  //       </div>

  //       <div className="text-center text-sm">
  //         <p className="text-muted-foreground">
  //           Didn&#39;t receive the email? Check your spam folder or{" "}
  //           <button
  //             onClick={resendVerificationEmail}
  //             className="underline underline-offset-4 hover:text-foreground"
  //             disabled={isResending}
  //           >
  //             try again
  //           </button>
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to create your account
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nivek Amure"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nivekamures@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="image">
                  Profile Image URL (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/your-image.jpg"
                    {...field}
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
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    {...field}
                    placeholder="••••••••••"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...field}
                    placeholder="••••••••••"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
}
