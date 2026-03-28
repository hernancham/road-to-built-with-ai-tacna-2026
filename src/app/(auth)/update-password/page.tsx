"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { updatePassword } from "@/lib/supabase/auth-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export default function UpdatePasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { password: "", confirm_password: "" },
    validators: { onSubmit: updatePasswordSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const result = await updatePassword({ password: value.password });
      if (result?.error) setServerError(result.error);
    },
  });

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Nueva contraseña</CardTitle>
        <CardDescription>
          Elige una contraseña segura para tu cuenta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="update-password-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* Nueva contraseña */}
          <form.Field
            name="password"
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Nueva contraseña</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={isInvalid ? "border-destructive" : ""}
                    autoComplete="new-password"
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

          {/* Confirmar contraseña */}
          <form.Field
            name="confirm_password"
            validators={{
              onChangeListenTo: ["password"],
              onChange: ({ value, fieldApi }) => {
                const password = fieldApi.form.getFieldValue("password");
                if (value && value !== password)
                  return "Las contraseñas no coinciden";
              },
            }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Confirmar contraseña</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Repite tu nueva contraseña"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={isInvalid ? "border-destructive" : ""}
                    autoComplete="new-password"
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
                {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
