"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiMenu3Line, RiBox3Line, RiArrowRightLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

export function Navbar() {
  const [mounted, setMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Network", href: "#network" },
    { name: "Solutions", href: "#services" },
    { name: "Tracking", href: "#tracking" },
    { name: "About", href: "#about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 h-16 border-b border-white/5 backdrop-blur-xl"
          : "h-20 border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-full max-w-[1400px] items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group focus-visible:ring-primary focus-visible:ring-offset-background flex items-center gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="TAC Cargo Home"
        >
          <div className="group-hover:border-primary/50 group-hover:bg-primary/10 relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-colors">
            <RiBox3Line className="text-primary h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-foreground text-base font-bold tracking-tight">
              TAC
            </span>
            <span className="text-muted-foreground group-hover:text-primary font-mono text-[10px] tracking-[0.2em] uppercase transition-colors">
              Infrastructure
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-1">
          <div className="flex items-center gap-1 rounded-full border border-white/5 bg-white/5 px-2 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-primary rounded-full px-4 py-1.5 text-xs font-medium transition-all hover:bg-white/5 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] focus-visible:ring-2 focus-visible:outline-none"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="hidden items-center gap-4 sm:flex">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-primary focus-visible:ring-primary rounded font-mono text-xs tracking-wider uppercase underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Sign In
            </Link>
            <Link
              href="#tracking"
              className="btn-primary shadow-primary/20 hover:shadow-primary/40 flex h-9 items-center rounded-lg px-5 text-xs font-bold tracking-wider uppercase shadow-lg transition-all"
            >
              Start Shipping
            </Link>
          </div>

          {/* Mobile Menu */}
          {mounted ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg hover:bg-white/5 md:hidden"
                >
                  <RiMenu3Line className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                title="Navigation"
                className="bg-background/95 w-[300px] border-l border-white/10 p-0 backdrop-blur-2xl"
              >
                <div className="flex h-full flex-col">
                  <div className="border-b border-white/5 p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-md">
                        <RiBox3Line className="h-5 w-5" />
                      </div>
                      <span className="font-bold">TAC</span>
                    </div>
                  </div>

                  <nav className="flex flex-1 flex-col gap-2 p-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="group text-muted-foreground hover:text-foreground focus-visible:ring-primary flex items-center justify-between rounded-xl p-3 text-sm font-medium transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
                      >
                        {link.name}
                        <RiArrowRightLine className="h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    ))}
                  </nav>

                  <div className="space-y-4 border-t border-white/5 bg-white/5 p-6">
                    <Link
                      href="/dashboard"
                      className="bg-background hover:border-primary/50 focus-visible:ring-primary flex w-full items-center justify-center rounded-xl border border-white/10 py-3 font-mono text-xs tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      Portal Login
                    </Link>
                    <Button
                      className="h-12 w-full rounded-xl text-xs font-bold tracking-wider uppercase"
                      asChild
                    >
                      <Link href="#tracking">Start Shipping</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden"
              disabled
            >
              <RiMenu3Line className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
