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
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { SigninFormSchema } from "./form-schemas/schemas";

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { push } = useRouter();
  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof SigninFormSchema>) {
    try {
      const { email, password } = values;

      await authClient.signIn.email(
        { email: email, password: password },
        {
          onSuccess: async (ctx) => {
            if (ctx.data.twoFactorRedirect) {
              // await authClient.twoFactor.sendOtp();
              push("/2fa-verification");
            } else {
              push("/dashboard");
            }
          },
          onError: async (ctx) => {
            toast.error("Error", {
              description: `${ctx.error.message}`,
              richColors: true,
            });
          },
        }
      );
    } catch (error) {
      toast.error("Error", {
        description: "Error logging in",
        richColors: true,
      });
      console.log(error);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );
}
