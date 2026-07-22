import Link from "next/link";

import { Command } from "lucide-react";

import { RegisterForm } from "../../_components/register-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

export default function RegisterV1() {
  return (
    <div className="flex h-dvh">
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="font-medium tracking-tight text-2xl">
              Inscription
            </div>
            <div className="mx-auto max-w-xl text-muted-foreground">
              Remplissez vos informations ci-dessous. Nous promettons de ne pas
              vous poser de questions sur le nom de votre premier animal de
              compagnie.
            </div>
          </div>
          <div className="space-y-4">
            <RegisterForm />
            <GoogleButton className="w-full" variant="outline" />
            <p className="text-center text-muted-foreground text-xs">
              Déjà un compte?{" "}
              <Link
                prefetch={false}
                href="/auth/v1/login"
                className="text-zeno-primary hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden bg-gradient-to-br from-zeno-secondary via-zeno-primary to-zeno-accent lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <Command className="mx-auto size-12 text-white" />
            <div className="space-y-2">
              <h1 className="font-light text-5xl text-white">Bienvenue!</h1>
              <p className="text-white/80 text-xl">Vous êtes au bon endroit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
