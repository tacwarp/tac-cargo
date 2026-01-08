"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiArrowLeftLine,
  RiMailLine,
  RiUserLine,
  RiBuilding2Line,
  RiPhoneLine,
} from "@remixicon/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function RequestAccessPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to actual API endpoint
      const response = await fetch("/api/access-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit request");
      }

      toast.success("Request Submitted", {
        description: "Our team will contact you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Access request error:", error);
      toast.error("Submission Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary group inline-flex items-center gap-2 text-sm transition-colors"
          >
            <RiArrowLeftLine className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="depth-surface noise-overlay border-none">
            <CardHeader className="pb-6 text-center">
              <CardTitle className="mb-2 text-3xl font-bold">
                Request Access
              </CardTitle>
              <p className="text-muted-foreground">
                Get started with TAC Cargo. Fill out the form below and our team
                will reach out to you.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-xs font-bold tracking-wider uppercase"
                    >
                      Full Name *
                    </Label>
                    <div className="relative">
                      <RiUserLine className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold tracking-wider uppercase"
                    >
                      Email Address *
                    </Label>
                    <div className="relative">
                      <RiMailLine className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="company"
                      className="text-xs font-bold tracking-wider uppercase"
                    >
                      Company Name *
                    </Label>
                    <div className="relative">
                      <RiBuilding2Line className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2" />
                      <Input
                        id="company"
                        name="company"
                        placeholder="Acme Corporation"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-bold tracking-wider uppercase"
                    >
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <RiPhoneLine className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-xs font-bold tracking-wider uppercase"
                  >
                    Tell us about your needs
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="What are your logistics requirements? How many shipments per month? Any specific features you need?"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary h-12 w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Submitting Request...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>

                <p className="text-muted-foreground text-center text-xs">
                  By submitting this form, you agree to our Terms of Service and
                  Privacy Policy. Our team typically responds within 24 hours.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
