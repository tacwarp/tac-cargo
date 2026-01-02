'use client'

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { RiMenu3Line, RiBox3Line, RiArrowRightLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Navbar() {
  const [mounted, setMounted] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Network", href: "#network" },
    { name: "Solutions", href: "#services" },
    { name: "Tracking", href: "#tracking" },
    { name: "About", href: "#about" },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "border-b border-white/5 bg-background/70 backdrop-blur-xl h-16" 
          : "border-transparent bg-transparent h-20"
      }`}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-6 max-w-[1400px]">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" aria-label="TAC Cargo Home">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
            <RiBox3Line className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">TAC</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Infrastructure</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-1">
          <div className="flex items-center gap-1 rounded-full border border-white/5 bg-white/5 px-2 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="hidden sm:flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Sign In
            </Link>
            <Link href="#tracking" className="btn-primary h-9 px-5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              Start Shipping
            </Link>
          </div>

          {/* Mobile Menu */}
          {mounted ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden rounded-lg hover:bg-white/5">
                  <RiMenu3Line className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" title="Navigation" className="w-[300px] border-l border-white/10 bg-background/95 backdrop-blur-2xl p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center text-primary">
                        <RiBox3Line className="h-5 w-5" />
                      </div>
                      <span className="font-bold">TAC</span>
                    </div>
                  </div>
                  
                  <nav className="flex-1 p-6 flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="group flex items-center justify-between p-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                      >
                        {link.name}
                        <RiArrowRightLine className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    ))}
                  </nav>

                  <div className="p-6 border-t border-white/5 space-y-4 bg-white/5">
                    <Link 
                      href="/dashboard" 
                      className="flex items-center justify-center w-full py-3 rounded-xl border border-white/10 bg-background text-xs font-mono uppercase tracking-wider hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      Portal Login
                    </Link>
                    <Button className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider" asChild>
                      <Link href="#tracking">Start Shipping</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" disabled>
              <RiMenu3Line className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
