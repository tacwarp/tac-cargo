"use client";

import { motion } from "framer-motion";
import { RiCheckLine, RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pricingPlans = [
  {
    name: "Starter",
    price: "₹9,999",
    period: "/month",
    description:
      "Perfect for small businesses starting their logistics journey",
    features: [
      "Up to 500 shipments/month",
      "Basic tracking & analytics",
      "Email support",
      "2 warehouse locations",
      "Standard API access",
      "Mobile app access",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "₹24,999",
    period: "/month",
    description: "Ideal for growing businesses with expanding logistics needs",
    features: [
      "Up to 2,500 shipments/month",
      "Advanced tracking & analytics",
      "Priority support (24/7)",
      "10 warehouse locations",
      "Full API access",
      "Mobile app access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large-scale operations",
    features: [
      "Unlimited shipments",
      "Real-time tracking & AI analytics",
      "White-glove support",
      "Unlimited warehouse locations",
      "Enterprise API & webhooks",
      "Custom mobile apps",
      "Advanced integrations",
      "Dedicated success team",
      "SLA guarantees",
      "Custom features",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary group inline-flex items-center gap-2 text-sm transition-colors"
          >
            <RiArrowLeftLine className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold md:text-5xl"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mx-auto max-w-2xl text-xl"
          >
            Choose the perfect plan for your logistics needs. All plans include
            a 14-day free trial.
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full ${
                  plan.popular
                    ? "border-primary shadow-primary/20 shadow-lg"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="pt-8 pb-8 text-center">
                  <CardTitle className="mb-2 text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <RiCheckLine className="text-primary mt-0.5 size-5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "btn-primary" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/request-access">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include 14-day free trial • No credit card required •
            Cancel anytime
          </p>
          <p className="text-muted-foreground text-sm">
            Need a custom solution?{" "}
            <Link
              href="/request-access"
              className="text-primary hover:underline"
            >
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
