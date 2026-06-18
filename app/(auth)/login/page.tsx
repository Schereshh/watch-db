"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, LockKeyhole, Mail } from "lucide-react";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    router.push("/profile");
  };

  return (
    <div className="w-full max-w-md rounded-md border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/70 sm:p-8">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 mb-7 text-stone-600 hover:bg-stone-100 hover:text-stone-950"
      >
        <Link href="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back home
        </Link>
      </Button>

      <div className="space-y-2">
        <p className="text-sm font-medium">Welcome back</p>
        <h1 className="text-3xl font-semibold ">Login</h1>
        <p className="text-sm text-stone-600">
          Sign in to manage your watchlist, watched movies, and ratings.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {formError && (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {formError}
          </p>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-800" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              className="border-stone-300 bg-stone-50 pl-10 text-stone-950 placeholder:text-stone-400 focus-visible:border-stone-500 focus-visible:ring-stone-200"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /.+@.+\..+/,
                  message: "Enter a valid email",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              className="border-stone-300 bg-stone-50 pl-10 text-stone-950 placeholder:text-stone-400 focus-visible:border-stone-500 focus-visible:ring-stone-200"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button
          className="w-full bg-stone-950 text-stone-50 hover:bg-stone-800"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        Don&apos;t have an account?{" "}
        <Button
          asChild
          variant="link"
          className="h-auto px-0 text-stone-950 underline-offset-4"
        >
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </p>
    </div>
  );
}
  
