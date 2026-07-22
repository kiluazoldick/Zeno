import Link from "next/link";

import { Command } from "lucide-react";

import { LoginForm } from "../../_components/login-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

export default function LoginV1() {
  return (
    <div className="flex h-dvh">
      <div className="hidden bg-gradient-to-br from-zeno-secondary via-zeno-primary to-zeno-accent lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <Command className="mx-auto size-12 text-white" />
            <div className="space-y-2">
              <h1 className="font-light text-5xl text-white">Bon retour</h1>
              <p className="text-white/80 text-xl">
                Connectez-vous pour continuer
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="font-medium tracking-tight text-2xl">Connexion</div>
            <div className="mx-auto max-w-xl text-muted-foreground">
              Bienvenue. Entrez votre email et mot de passe, espérons que vous
              vous en souvenez.
            </div>
          </div>
          <div className="space-y-4">
            <LoginForm />
            <GoogleButton className="w-full" variant="outline" />
            <p className="text-center text-muted-foreground text-xs">
              Pas encore de compte?{" "}
              <Link
                prefetch={false}
                href="/auth/v1/register"
                className="text-zeno-primary hover:underline"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
