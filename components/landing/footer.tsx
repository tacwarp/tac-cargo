'use client'

import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-12">
      <div className="container mx-auto max-w-[1400px] px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="h-4 w-4 bg-foreground rounded-sm transition-transform group-hover:rotate-45" />
              <span className="font-semibold tracking-tight text-foreground">TAC</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Elite logistics infrastructure tailored for the modern enterprise. 
              <br />
              Imphal — New Delhi.
            </p>
          </div>
          
          <div className="flex gap-16">
            <div>
              <h4 className="text-foreground text-xs font-bold uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#tracking" className="hover:text-foreground transition-colors">Tracking</Link></li>
                <li><Link href="#services" className="hover:text-foreground transition-colors">Services</Link></li>
                <li><Link href="#network" className="hover:text-foreground transition-colors">Network</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground text-xs font-bold uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Legal</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
            2025 TAC Logistics Protocol. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
