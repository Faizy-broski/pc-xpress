"use client"

import { useActionState } from "react"
import { AlertCircleIcon, Loader2Icon, LockIcon, MailIcon } from "lucide-react"

import { login, type AuthFormState } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: AuthFormState = {}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
        <div className="relative">
          <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            autoFocus
            className="h-11 rounded-xl pl-10"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
        <div className="relative">
          <LockIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="h-11 rounded-xl pl-10"
          />
        </div>
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="mt-1 h-11 rounded-xl bg-gradient-button shadow-glow"
      >
        {pending && <Loader2Icon className="animate-spin" />}
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Access is by invitation only. Ask your shop admin if you need an account.
      </p>
    </form>
  )
}
