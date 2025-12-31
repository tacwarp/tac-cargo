'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm border border-border bg-muted/20 transition-colors group-hover:border-primary/50">
            <Package className="h-4 w-4 text-foreground transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-foreground">TAC</span>
            <span className="mt-[2px] font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Infrastructure</span>
          </div>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Back Link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {/* Login Form Container */}
          <div className="space-y-6 border border-border bg-card p-8">
            {/* Corner Accents */}
            <div className="relative">
              <div className="absolute -left-8 -top-8 h-3 w-3 border-l border-t border-primary/30"></div>
              <div className="absolute -right-8 -top-8 h-3 w-3 border-r border-t border-primary/30"></div>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Authentication Protocol</span>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in to Portal</h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access the logistics dashboard.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@tac.cargo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-none border-border bg-background font-mono text-sm focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Password
                  </Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-none border-border bg-background font-mono text-sm focus-visible:ring-primary"
                />
              </div>

              <Button 
                type="submit" 
                className="h-12 w-full rounded-none font-mono text-xs font-bold uppercase tracking-widest"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Execute Login'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-4 font-mono uppercase tracking-widest text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            {/* Alternative Actions */}
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Request Access
              </Link>
            </div>

            {/* Bottom Corner Accents */}
            <div className="relative">
              <div className="absolute -bottom-8 -left-8 h-3 w-3 border-b border-l border-primary/30"></div>
              <div className="absolute -bottom-8 -right-8 h-3 w-3 border-b border-r border-primary/30"></div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-mono uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </main>
    </div>
  )
}
