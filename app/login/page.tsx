"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiMailLine,
  RiLockLine,
  RiArrowLeftLine,
  RiShieldCheckLine,
  RiCheckboxCircleLine,
  RiTruckLine,
  RiArrowRightLine,
} from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { LottieContainer } from "@/components/ui/lottie-container";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

// Variants for staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      router.refresh();
      router.push("/dashboard");
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
    <div className="bg-background text-foreground flex min-h-screen w-full overflow-hidden">
      {/* Visual Side (Left) - 60% */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-background p-16 lg:flex"
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="bg-gradient-mesh absolute inset-0 opacity-30 blur-[80px]" />
          <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-background via-background/80 to-transparent" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid opacity-10" />
        </div>

        {/* Branding */}
        <div className="relative z-10">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="group-hover:border-primary/50 flex h-12 w-12 items-center justify-center rounded-xl border border-border/40 glass-effect transition-colors">
              <div className="bg-primary h-6 w-6 rounded-lg shadow-2xl shadow-primary/50" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                TAC
              </div>
              <div className="font-mono text-xs tracking-[0.2em] text-muted-foreground/60">
                INFRASTRUCTURE
              </div>
            </div>
          </Link>
        </div>

        {/* Center Visual - 3D/Lottie */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          {/* Constrained Container */}
          <div className="relative flex aspect-square h-auto w-[80%] max-w-[600px] items-center justify-center p-8">
            {/* Gradient glow behind placeholder */}
            <div className="bg-primary/10 absolute inset-0 rounded-full blur-[100px]" />

            <div className="h-full w-full opacity-90 mix-blend-screen contrast-125 grayscale-[20%]">
              <LottieContainer
                src="/lottie/CORRIDOR_VISUALIZATION.json"
                className="h-full w-full object-contain"
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
            className="text-foreground text-5xl leading-[1.1] font-bold"
          >
            Orchestrating <br />
            <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
              Global Commerce.
            </span>
          </motion.h2>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: RiShieldCheckLine, text: "Military-Grade Encryption" },
              { icon: RiTruckLine, text: "Autonomous Fleet Control" },
              { icon: RiCheckboxCircleLine, text: "99.99% Uptime SLA" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="text-muted-foreground flex items-center gap-3"
              >
                <feature.icon className="text-primary h-5 w-5" />
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Form Side (Right) - 40% */}
      <div className="bg-background relative flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-12">
        {/* Theme Toggle - Absolute Top Right */}
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Mobile Background Elements */}
        <div className="from-primary/10 to-background absolute inset-0 z-0 bg-gradient-to-b lg:hidden" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-sm space-y-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary group mb-6 inline-flex items-center gap-2 text-sm transition-colors"
            >
              <RiArrowLeftLine className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Return to Base
            </Link>
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Identity Verification
            </h1>
            <p className="text-muted-foreground">
              Authorized operatives only. Enter your credentials to access the
              command center.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="operative-id"
                  className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase"
                >
                  Operative ID
                </label>
                <div className="group relative">
                  <RiMailLine className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors" />
                  <input
                    id="operative-id"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    autoComplete="email"
                    required
                    className="bg-secondary/30 border-border focus:border-primary/50 focus:bg-secondary/50 focus:ring-primary/10 text-foreground placeholder:text-muted-foreground/40 w-full rounded-xl border py-3.5 pr-4 pl-12 font-medium transition-all outline-none focus:ring-4"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="security-key"
                    className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase"
                  >
                    Security Key
                  </label>
                  <Link
                    href="#"
                    className="text-primary text-xs hover:underline"
                  >
                    Lost access?
                  </Link>
                </div>
                <div className="group relative">
                  <RiLockLine className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors" />
                  <input
                    id="security-key"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="bg-secondary/30 border-border focus:border-primary/50 focus:bg-secondary/50 focus:ring-primary/10 text-foreground placeholder:text-muted-foreground/40 w-full rounded-xl border py-3.5 pr-12 pl-12 font-medium transition-all outline-none focus:ring-4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                  >
                    {showPassword ? (
                      <RiEyeOffLine className="h-5 w-5" />
                    ) : (
                      <RiEyeLine className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/40 relative h-14 w-full overflow-hidden rounded-xl font-bold tracking-wide shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      AUTHENTICATING...
                    </>
                  ) : (
                    <>
                      INITIATE SESSION
                      <RiArrowRightLine className="h-5 w-5" />
                    </>
                  )}
                </span>
              </button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
              New to the network?{" "}
              <Link
                href="/request-access"
                className="text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Request Clearance
              </Link>
            </p>

            <div className="text-muted-foreground/60 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest uppercase">
              <RiShieldCheckLine className="h-3 w-3" />
              <span>End-to-End Encrypted</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
