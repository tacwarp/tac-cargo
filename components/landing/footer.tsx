"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin, RefreshCw, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative bg-background pt-20 pb-10">
      <div className="sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto px-4">
        <div className="overflow-hidden xl:bg-card/60 border border-white/10 border-dashed rounded-3xl mt-6 relative backdrop-blur-md">
          {/* Background Effects */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 opacity-70 [mask-image:radial-gradient(65%_65%_at_50%_50%,black,transparent)] bg-[radial-gradient(1200px_400px_at_50%_-10%,oklch(from_var(--primary)_l_c_h_/_0.15),transparent),radial-gradient(1200px_600px_at_50%_120%,oklch(from_var(--accent)_l_c_h_/_0.15),transparent)]" />
            <div className="absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(80%_80%_at_50%_50%,black,transparent)] bg-[linear-gradient(to_right,rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:28px_28px]" />
          </div>

          {/* Floating Utility Icon */}
          <div className="absolute left-5 top-5 hidden lg:block">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 backdrop-blur">
              <RefreshCw className="h-4 w-4 text-primary animate-spin-slow" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col sm:py-16 md:px-8 text-center mx-auto pt-16 pb-16 px-4 relative items-center justify-center">
            <div className="w-full max-w-7xl">
              {/* Footer Top */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-white/10">
                {/* Brand Column */}
                <div className="lg:col-span-2 text-left">
                  <div className="flex flex-col items-start">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-4 group">
                      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
                        <Box className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="flex flex-col leading-none">
                        <span className="text-lg font-bold tracking-tight text-foreground">
                          TAC
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground group-hover:text-primary transition-colors">
                          Infrastructure
                        </span>
                      </div>
                    </Link>

                    {/* Description */}
                    <p className="leading-relaxed text-sm text-muted-foreground max-w-xs mb-6">
                      Deploy at cargo speed. The fastest way to ship your
                      logistics globally with zero configuration.
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-3">
                      {[
                        { icon: Twitter, href: "https://twitter.com/taclogistics", label: "Follow us on Twitter" },
                        { icon: Github, href: "https://github.com/taclogistics", label: "View our GitHub" },
                        { icon: Linkedin, href: "https://linkedin.com/company/taclogistics", label: "Connect on LinkedIn" },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          aria-label={item.label}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 ring-1 ring-white/10 transition hover:bg-primary/20 hover:text-primary text-muted-foreground"
                        >
                          <item.icon className="h-4 w-4" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product */}
                <div className="text-left">
                  <h4 className="text-foreground text-sm font-semibold mb-4 tracking-tight">
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
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="text-left">
                  <h4 className="text-foreground text-sm font-semibold mb-4 tracking-tight">
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
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div className="text-left">
                  <h4 className="text-foreground text-sm font-semibold mb-4 tracking-tight">
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
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Bottom */}
              <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
                <p className="text-sm text-muted-foreground/60 font-mono">
                  © {new Date().getFullYear()} TAC Logistics Protocol. All rights reserved.
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
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="flex md:hidden mt-6 items-center justify-between gap-4 px-4">
          <Button variant="outline" className="w-full rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-muted-foreground" asChild>
            <a href="mailto:contact@taccargo.com">Contact</a>
          </Button>
          <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href="#tracking">Join Waitlist</a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
