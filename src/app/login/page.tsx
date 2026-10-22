"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import { homeFor } from "@/lib/types";
import { loginSchema, type LoginValues } from "@/lib/validators";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (!loading && user) router.replace(homeFor(user.role));
  }, [loading, user, router]);

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      const u = await login(values);
      router.replace(homeFor(u.role));
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not log in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Log in to submit or review projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              label="Email"
              htmlFor="email"
              error={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </FormField>
            <FormField
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
            >
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
            </FormField>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Log
              in
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New student?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
