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
    <Card className="shadow-2xl border-none bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
      <CardHeader className="space-y-2 pb-6 text-center bg-linear-to-b from-primary-container/10 to-transparent">
        <CardTitle className="text-3xl font-extrabold font-headline text-primary-brand tracking-tight">Crear cuenta</CardTitle>
        <CardDescription className="text-on-surface-variant font-medium">
          Únete a la nueva era de salud digital
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-5"
        >
          {/* Nombre completo */}
          <form.Field name="full_name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">Nombre completo</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Juan Pérez García"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={`h-12 rounded-2xl border-outline-variant/30 bg-surface-container-low focus:ring-primary-brand/20 focus:border-primary-brand transition-all ${isInvalid ? "border-error bg-error/5" : ""}`}
                    autoComplete="name"
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

          {/* DNI y Teléfono en fila */}
          <div className="grid grid-cols-2 gap-4">
            {/* DNI */}
            <form.Field name="dni">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">DNI</Label>
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
                      className={`h-12 rounded-2xl border-outline-variant/30 bg-surface-container-low focus:ring-primary-brand/20 focus:border-primary-brand transition-all ${isInvalid ? "border-error bg-error/5" : ""}`}
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

            {/* Teléfono */}
            <form.Field name="phone">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">Teléfono</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      placeholder="987654321"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      className={`h-12 rounded-2xl border-outline-variant/30 bg-surface-container-low focus:ring-primary-brand/20 focus:border-primary-brand transition-all ${isInvalid ? "border-error bg-error/5" : ""}`}
                      autoComplete="tel"
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
          </div>

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
                    placeholder="tu@correo.com"
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
                  <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1">Contraseña</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className={`h-12 rounded-2xl border-outline-variant/30 bg-surface-container-low focus:ring-primary-brand/20 focus:border-primary-brand transition-all ${isInvalid ? "border-error bg-error/5" : ""}`}
                    autoComplete="new-password"
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
                        Creando cuenta...
                    </div>
                ) : "Crear cuenta"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pb-8 pt-2">
        <p className="text-sm text-on-surface-variant font-medium">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-primary-brand font-bold hover:underline underline-offset-4"
          >
            Inicia sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
