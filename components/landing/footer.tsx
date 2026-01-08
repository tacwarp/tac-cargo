"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin, RefreshCw, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-background relative pt-20 pb-10">
      <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-7xl px-4 duration-1000 sm:px-6 lg:px-8">
        <div className="relative mt-6">
          {/* Floating Utility Icon */}
          <div className="absolute top-5 left-5 hidden lg:block">
            <div className="bg-primary/10 ring-primary/20 flex h-9 w-9 items-center justify-center rounded-lg ring-1 backdrop-blur">
              <RefreshCw className="text-primary animate-spin-slow h-4 w-4" />
            </div>
          </div>

          {/* Content */}
          <div className="relative mx-auto flex flex-col items-center justify-center px-4 pt-16 pb-16 text-center sm:py-16 md:px-8">
            <div className="w-full max-w-7xl">
              {/* Footer Top */}
              <div className="border-border/10 grid grid-cols-1 gap-12 border-b pb-12 md:grid-cols-2 lg:grid-cols-5">
                {/* Brand Column */}
                <div className="text-left lg:col-span-2">
                  <div className="flex flex-col items-start">
                    {/* Logo */}
                    <Link
                      href="/"
                      className="group mb-4 flex items-center gap-2"
                    >
                      <div className="border-border/10 bg-background/40 group-hover:border-primary/50 group-hover:bg-primary/10 relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border transition-colors">
                        <Box className="text-primary h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="flex flex-col leading-none">
                        <span className="text-foreground text-lg font-bold tracking-tight">
                          TAC
                        </span>
                        <span className="text-muted-foreground group-hover:text-primary font-mono text-[10px] tracking-[0.25em] uppercase transition-colors">
                          Infrastructure
                        </span>
                      </div>
                    </Link>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 max-w-xs text-sm leading-relaxed">
                      Deploy at cargo speed. The fastest way to ship your
                      logistics globally with zero configuration.
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-3">
                      {[
                        {
                          icon: Twitter,
                          href: "https://twitter.com/taclogistics",
                          label: "Follow us on Twitter",
                        },
                        {
                          icon: Github,
                          href: "https://github.com/taclogistics",
                          label: "View our GitHub",
                        },
                        {
                          icon: Linkedin,
                          href: "https://linkedin.com/company/taclogistics",
                          label: "Connect on LinkedIn",
                        },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          aria-label={item.label}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:bg-primary/20 hover:text-primary text-muted-foreground flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 transition"
                        >
                          <item.icon className="h-4 w-4" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product */}
                <div className="text-left">
                  <h4 className="text-foreground mb-4 text-sm font-semibold tracking-tight">
                    Product
                  </h4>
                  <ul className="space-y-3">
                    {[
                      { name: "Features", href: "/#features" },
                      { name: "Pricing", href: "/pricing" },
                      { name: "Enterprise", href: "/enterprise" },
                      { name: "Changelog", href: "/changelog" },
                    ].map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-primary block text-sm transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="text-left">
                  <h4 className="text-foreground mb-4 text-sm font-semibold tracking-tight">
                    Resources
                  </h4>
                  <ul className="space-y-3">
                    {[
                      { name: "Documentation", href: "/docs" },
                      { name: "Guides", href: "/docs/guides" },
                      { name: "API Reference", href: "/docs/api" },
                      { name: "Status", href: "/status" },
                    ].map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-primary block text-sm transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div className="text-left">
                  <h4 className="text-foreground mb-4 text-sm font-semibold tracking-tight">
                    Company
                  </h4>
                  <ul className="space-y-3">
                    {[
                      { name: "About", href: "/about" },
                      { name: "Blog", href: "/blog" },
                      { name: "Careers", href: "/careers" },
                      { name: "Legal", href: "/legal" },
                    ].map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-primary block text-sm transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Bottom */}
              <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
                <p className="text-muted-foreground/60 font-mono text-sm">
                  © {new Date().getFullYear()} TAC Logistics Protocol. All
                  rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  {[
                    { name: "Privacy", href: "/privacy" },
                    { name: "Terms", href: "/terms" },
                    { name: "Security", href: "/security" },
                    { name: "Status", href: "/status" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary actions for small screens */}
        <div className="mt-6 flex items-center justify-between gap-4 px-4 md:hidden">
          <Button
            variant="outline"
            className="text-muted-foreground w-full rounded-xl border-border bg-muted/5 hover:bg-muted/10"
            asChild
          >
            <a href="mailto:contact@taccargo.com">Contact</a>
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl"
            asChild
          >
            <a href="#tracking">Join Waitlist</a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
