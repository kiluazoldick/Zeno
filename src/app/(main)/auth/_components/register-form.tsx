"use client";

import { useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { register } from "@/lib/actions/auth/register";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await register(formData);

    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Erreur d'inscription",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="prenom">Prénom</FieldLabel>
          <InputGroup className="h-11 bg-muted/30 transition-colors focus-within:bg-background">
            <InputGroupAddon>
              <UserRound className="size-4" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id="prenom"
              name="prenom"
              type="text"
              placeholder="Nanga"
              autoComplete="given-name"
            />
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel htmlFor="nom">Nom</FieldLabel>
          <InputGroup className="h-11 bg-muted/30 transition-colors focus-within:bg-background">
            <InputGroupAddon>
              <UserRound className="size-4" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id="nom"
              name="nom"
              type="text"
              placeholder="Doumer"
              autoComplete="family-name"
              required
            />
          </InputGroup>
        </Field>
      </div>

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
            placeholder="8 caractères minimum"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </InputGroup>
        <FieldDescription>Utilisez au moins 8 caractères.</FieldDescription>
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
        {loading ? "Création du compte..." : "Créer mon compte"}
      </Button>
    </form>
  );
}
