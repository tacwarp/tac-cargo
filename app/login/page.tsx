'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine, RiArrowLeftLine, RiShieldCheckLine, RiCheckboxCircleLine, RiTruckLine, RiArrowRightLine } from "@remixicon/react"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { LottieContainer } from "@/components/ui/lottie-container"
import { ThemeToggle } from "@/components/ui/theme-toggle"

// Variants for staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10
    }
  }
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Authentication Failed", {
          description: error.message,
        });
        return;
      }

      toast.success("Security Clearance Granted", {
        description: "Welcome back, Operative.",
      });

      router.push('/dashboard');
      router.refresh();

    } catch (err) {
      console.error("Login error:", err);
      toast.error("System Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden">

      {/* Visual Side (Left) - 60% */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden bg-black"
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--gradient-start)_0%,_transparent_50%)] opacity-30 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        {/* Branding */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
            </div>
            <div>
              <div className="text-white font-bold text-2xl tracking-tight">TAC</div>
              <div className="text-white/40 text-xs tracking-[0.2em] font-mono">INFRASTRUCTURE</div>
            </div>
          </Link>
        </div>

        {/* Center Visual - 3D/Lottie */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          {/* Constrained Container */}
          <div className="w-[80%] max-w-[600px] h-auto aspect-square flex items-center justify-center relative p-8">
            {/* Gradient glow behind placeholder */}
            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />

            <div className="w-full h-full opacity-90 mix-blend-screen grayscale-[20%] contrast-125">
              <LottieContainer
                src="/lottie/CORRIDOR_VISUALIZATION.json"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="relative z-10 max-w-xl space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-bold text-white leading-[1.1]"
          >
            Orchestrating <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Global Commerce.</span>
          </motion.h2>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: RiShieldCheckLine, text: "Military-Grade Encryption" },
              { icon: RiTruckLine, text: "Autonomous Fleet Control" },
              { icon: RiCheckboxCircleLine, text: "99.99% Uptime SLA" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (i * 0.1) }}
                className="flex items-center gap-3 text-white/70"
              >
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Form Side (Right) - 40% */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative bg-background">
        {/* Theme Toggle - Absolute Top Right */}
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm space-y-10 relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
            >
              <RiArrowLeftLine className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Base
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Identity Verification</h1>
            <p className="text-muted-foreground">Authorized operatives only. Enter your credentials to access the command center.</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="operative-id" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Operative ID</label>
                <div className="relative group">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="operative-id"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    autoComplete="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-secondary/30 border border-border focus:border-primary/50 focus:bg-secondary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-foreground placeholder:text-muted-foreground/40 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="security-key" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Security Key</label>
                  <Link href="#" className="text-xs text-primary hover:underline">Lost access?</Link>
                </div>
                <div className="relative group">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="security-key"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-secondary/30 border border-border focus:border-primary/50 focus:bg-secondary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-foreground placeholder:text-muted-foreground/40 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <RiEyeOffLine className="w-5 h-5" /> : <RiEyeLine className="w-5 h-5" />}
                  </button>
                </div>
              </div>

            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden group btn-primary h-14 rounded-xl font-bold tracking-wide text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      AUTHENTICATING...
                    </>
                  ) : (
                    <>
                      INITIATE SESSION
                      <RiArrowRightLine className="w-5 h-5" />
                    </>
                  )}
                </span>
              </button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              New to the network?{' '}
              <Link href="/request-access" className="text-primary font-medium hover:text-primary-hover transition-colors">
                Request Clearance
              </Link>
            </p>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono">
              <RiShieldCheckLine className="w-3 h-3" />
              <span>End-to-End Encrypted</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
