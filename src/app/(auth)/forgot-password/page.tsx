"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/lib/supabase/auth-actions";
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

const forgotSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
});

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);
      const result = await forgotPassword(value);
      if (result?.error) {
        setServerError(result.error);
      } else if (result?.success) {
        setSuccessMessage(result.success);
        form.reset();
      }
    },
  });

  return (
    <Card className="shadow-2xl border-none bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
      <CardHeader className="space-y-2 pb-8 text-center bg-linear-to-b from-primary-container/10 to-transparent">
        <CardTitle className="text-3xl font-extrabold font-headline text-primary-brand tracking-tight">Recuperar Acceso</CardTitle>
        <CardDescription className="text-on-surface-variant font-medium">
          Te enviaremos un enlace seguro para restablecer tu cuenta
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          id="forgot-password-form"
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

          {/* Error del servidor */}
          {serverError && (
            <div className="rounded-2xl bg-error/10 border border-error/20 px-4 py-3 flex items-center gap-3 animate-in fade-in zoom-in-95">
              <span className="material-symbols-outlined text-error text-xl">error</span>
              <p className="text-sm text-error font-medium">{serverError}</p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="rounded-2xl bg-secondary-container/20 border border-secondary-container/40 px-4 py-3 flex items-center gap-3 animate-in fade-in zoom-in-95">
              <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
              <p className="text-sm text-on-secondary-container font-medium">{successMessage}</p>
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
                        Enviando...
                    </div>
                ) : "Enviar enlace"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pb-8 pt-2">
        <Link
          href="/login"
          className="text-sm font-bold text-primary-brand hover:opacity-70 transition-opacity underline-offset-4 hover:underline"
        >
          ← Volver al inicio de sesión
        </Link>
      </CardFooter>
    </Card>
  );
}
