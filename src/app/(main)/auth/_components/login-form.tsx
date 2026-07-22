"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/actions/auth/login";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

export function LoginForm() {
  const router = useRouter();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="email">Email address</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </InputGroup>
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </InputGroup>
      </Field>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-zeno-primary hover:bg-zeno-primary/90"
      >
        {loading ? "Connexion..." : "Login"}
      </Button>
    </form>
  );
}
