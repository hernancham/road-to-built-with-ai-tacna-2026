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
    <Card className="shadow-2xl border-none bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
      <CardHeader className="space-y-2 pb-8 text-center bg-linear-to-b from-primary-container/10 to-transparent">
        <CardTitle className="text-3xl font-extrabold font-headline text-primary-brand tracking-tight">Bienvenido</CardTitle>
        <CardDescription className="text-on-surface-variant font-medium">
          Accede a tu plataforma de salud inteligente
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          {/* Email */}
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">Correo electrónico</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={`h-12 rounded-2xl border-outline-variant/30 bg-surface-container-low focus:ring-primary-brand/20 focus:border-primary-brand transition-all ${isInvalid ? "border-error bg-error/5" : ""}`}
                    autoComplete="email"
                  />
                  {isInvalid && (
                    <p className="text-xs text-error font-medium ml-1">
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">Contraseña</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-primary-brand hover:opacity-70 transition-opacity"
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
                    className={`h-12 rounded-2xl border-outline-variant/30 bg-surface-container-low focus:ring-primary-brand/20 focus:border-primary-brand transition-all ${isInvalid ? "border-error bg-error/5" : ""}`}
                    autoComplete="current-password"
                  />
                  {isInvalid && (
                    <p className="text-xs text-error font-medium ml-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Error del servidor */}
          {serverError && (
            <div className="rounded-2xl bg-error/10 border border-error/20 px-4 py-3 flex items-center gap-3 animate-in fade-in zoom-in-95">
              <span className="material-symbols-outlined text-error text-xl">error</span>
              <p className="text-sm text-error font-medium">{serverError}</p>
            </div>
          )}

          {/* Submit */}
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full h-14 mt-2 rounded-2xl bg-primary-brand hover:bg-primary-brand/90 text-white font-bold text-lg shadow-lg shadow-primary-brand/20 transition-all active:scale-95 disabled:opacity-50"
                disabled={!canSubmit || (isSubmitting as boolean)}
              >
                {isSubmitting ? (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        Iniciando...
                    </div>
                ) : "Iniciar sesión"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pb-8 pt-2">
        <p className="text-sm text-on-surface-variant font-medium">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="text-primary-brand font-bold hover:underline underline-offset-4"
          >
            Regístrate gratis
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
