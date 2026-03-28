"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { signUp } from "@/lib/supabase/auth-actions";
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

const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(3, "El nombre completo debe tener al menos 3 caracteres"),
    dni: z
      .string()
      .min(8, "El DNI debe tener 8 dígitos")
      .max(8, "El DNI debe tener 8 dígitos")
      .regex(/^\d+$/, "El DNI solo debe contener números"),
    phone: z
      .string()
      .min(9, "Ingresa un número válido")
      .regex(/^[0-9+\s\-()]+$/, "Número de teléfono inválido"),
    email: z.string().email("Ingresa un correo válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      full_name: "",
      dni: "",
      phone: "",
      email: "",
      password: "",
      confirm_password: "",
    } satisfies RegisterForm,
    validators: { onSubmit: registerSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);
      const result = await signUp({
        email: value.email,
        password: value.password,
        full_name: value.full_name,
        dni: value.dni,
        phone: value.phone,
      });
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
        <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
        <CardDescription>
          Regístrate para participar en la Hackaton GDG Tacna 2026
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* Nombre completo */}
          <form.Field name="full_name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Nombre completo</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Juan Pérez García"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={isInvalid ? "border-destructive" : ""}
                    autoComplete="name"
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

          {/* DNI y Teléfono en fila */}
          <div className="grid grid-cols-2 gap-3">
            {/* DNI */}
            <form.Field name="dni">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>DNI</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="12345678"
                      maxLength={8}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value.replace(/\D/g, ""))
                      }
                      aria-invalid={isInvalid}
                      className={isInvalid ? "border-destructive" : ""}
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

            {/* Teléfono */}
            <form.Field name="phone">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>Teléfono</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      placeholder="987654321"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      className={isInvalid ? "border-destructive" : ""}
                      autoComplete="tel"
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
          </div>

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
                  <Label htmlFor={field.name}>Contraseña</Label>
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

          {/* Confirmar Password */}
          <form.Field
            name="confirm_password"
            validators={{
              onChangeListenTo: ["password"],
              onChange: ({ value, fieldApi }) => {
                const password = fieldApi.form.getFieldValue("password");
                if (value && value !== password)
                  return "Las contraseñas no coinciden";
                return undefined;
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
                    placeholder="Repite tu contraseña"
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
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
