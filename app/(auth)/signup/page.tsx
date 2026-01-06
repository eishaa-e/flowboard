import { GalleryVerticalEnd } from "lucide-react"

import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-transparent text-primary">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Flowboard
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden w-full h-full lg:flex items-center justify-center bg-muted">
        <div className="absolute inset-0 bg-zinc-900/10 z-10" />
        <img
          src="/auth-bg.png"
          alt="Flowboard Authentication"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="relative z-20 flex items-center gap-3 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Flowboard</span>
        </div>
      </div>
    </div>
  )
}
