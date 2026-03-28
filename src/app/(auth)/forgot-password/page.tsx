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
    <Card className="shadow-lg border-border/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Recuperar contraseña
        </CardTitle>
        <CardDescription>
          Te enviaremos un enlace para restablecer tu contraseña
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="forgot-password-form"
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

          {/* Error del servidor */}
          {serverError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2">
              <p className="text-sm text-green-700 dark:text-green-400">
                {successMessage}
              </p>
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
                {isSubmitting ? "Enviando..." : "Enviar enlace de recuperación"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            ← Volver al inicio de sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
