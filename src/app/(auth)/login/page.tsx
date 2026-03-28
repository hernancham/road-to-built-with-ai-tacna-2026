"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "@/lib/supabase/auth-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const result = await signIn(value);
      if (result?.error) setServerError(result.error);
    },
  });

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Correo electrónico</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="tu@correo.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={isInvalid ? "border-destructive" : ""}
                    autoComplete="email"
                  />
                  {isInvalid && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.name}>Contraseña</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={isInvalid ? "border-destructive" : ""}
                    autoComplete="current-password"
                  />
                  {isInvalid && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Error del servidor */}
          {serverError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          {/* Submit */}
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full mt-1"
                disabled={!canSubmit || (isSubmitting as boolean)}
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
