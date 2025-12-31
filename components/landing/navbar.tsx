'use client'

import Link from "next/link"
import { Menu, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Navbar() {
  const navLinks = [
    { name: "Network", href: "#network" },
    { name: "Solutions", href: "#services" },
    { name: "Tracking", href: "#tracking" },
    { name: "About", href: "#about" },
  ]

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-6 max-w-[1400px]">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="TAC Cargo Home">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm border border-border bg-muted/20 transition-colors group-hover:border-primary/50">
            <Package className="h-4 w-4 text-foreground transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-foreground">TAC</span>
            <span className="mt-[2px] font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Infrastructure</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-sm text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link 
            href="/login" 
            className="hidden rounded-sm text-[11px] font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:block"
          >
            Sign In
          </Link>
          <Button 
            size="sm" 
            className="h-8 px-4 text-[11px] font-medium uppercase tracking-wider rounded-sm focus-visible:ring-offset-2"
            asChild
          >
            <Link href="#tracking">Start Shipping</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-border bg-background/95 backdrop-blur-xl">
              <div className="flex flex-col gap-6 mt-8">
                <nav className="flex flex-col gap-4" aria-label="Mobile Navigation">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="rounded-sm py-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="h-px bg-border/50" />
                <div className="flex flex-col gap-4">
                  <Link 
                    href="/dashboard" 
                    className="rounded-sm py-2 text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Portal Login
                  </Link>
                  <Button className="w-full uppercase tracking-wider" asChild>
                    <Link href="#tracking">Start Shipping</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
