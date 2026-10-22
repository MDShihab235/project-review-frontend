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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import { homeFor } from "@/lib/types";
import { signupSchema, type SignupValues } from "@/lib/validators";

export default function SignupPage() {
  const { user, loading, signup } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (!loading && user) router.replace(homeFor(user.role));
  }, [loading, user, router]);

  const onSubmit = async ({ confirmPassword: _ignored, ...values }: SignupValues) => {
    setSubmitting(true);
    try {
      const u = await signup(values);
      toast.success("Account created");
      router.replace(homeFor(u.role));
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 409) setError("email", { message: e.message });
        e.errors?.forEach((x) => x.field in values && setError(x.field as keyof SignupValues, { message: x.message }));
        toast.error(e.message);
      } else toast.error("Could not create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create student account</CardTitle>
          <CardDescription>Sign up to submit your projects for mentor review.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
              <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
            </FormField>
            <FormField label="Email" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
            </FormField>
            <FormField label="Password" htmlFor="password" error={errors.password?.message} hint="8+ chars, letter and number">
              <Input id="password" type="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
            </FormField>
            <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
              <Input id="confirmPassword" type="password" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
            </FormField>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Sign up
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
