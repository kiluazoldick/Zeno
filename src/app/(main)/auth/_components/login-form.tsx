"use client";

import { useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { login } from "@/lib/actions/auth/login";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(
        typeof result.error === "string" ? result.error : "Erreur de connexion",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field>
        <FieldLabel htmlFor="email">Adresse email</FieldLabel>
        <InputGroup className="h-11 bg-muted/30 transition-colors focus-within:bg-background">
          <InputGroupAddon>
            <Mail className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id="email"
            name="email"
            type="email"
            placeholder="vous@exemple.com"
            autoComplete="email"
            required
          />
        </InputGroup>
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
        <InputGroup className="h-11 bg-muted/30 transition-colors focus-within:bg-background">
          <InputGroupAddon>
            <LockKeyhole className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id="password"
            name="password"
            type="password"
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            required
          />
        </InputGroup>
      </Field>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-destructive text-sm"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-zeno-primary font-semibold text-white shadow-sm transition-transform hover:bg-zeno-primary/90 active:scale-[0.99]"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
