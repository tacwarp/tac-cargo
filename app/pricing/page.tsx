'use client'

import { motion } from 'framer-motion'
import { RiCheckLine, RiArrowLeftLine } from '@remixicon/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const pricingPlans = [
  {
    name: 'Starter',
    price: '₹9,999',
    period: '/month',
    description: 'Perfect for small businesses starting their logistics journey',
    features: [
      'Up to 500 shipments/month',
      'Basic tracking & analytics',
      'Email support',
      '2 warehouse locations',
      'Standard API access',
      'Mobile app access',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '₹24,999',
    period: '/month',
    description: 'Ideal for growing businesses with expanding logistics needs',
    features: [
      'Up to 2,500 shipments/month',
      'Advanced tracking & analytics',
      'Priority support (24/7)',
      '10 warehouse locations',
      'Full API access',
      'Mobile app access',
      'Custom integrations',
      'Dedicated account manager',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large-scale operations',
    features: [
      'Unlimited shipments',
      'Real-time tracking & AI analytics',
      'White-glove support',
      'Unlimited warehouse locations',
      'Enterprise API & webhooks',
      'Custom mobile apps',
      'Advanced integrations',
      'Dedicated success team',
      'SLA guarantees',
      'Custom features',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-16'>
        <div className='mb-8'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group'
          >
            <RiArrowLeftLine className='size-4 group-hover:-translate-x-1 transition-transform' />
            Back to Home
          </Link>
        </div>

        <div className='text-center mb-16'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-4xl md:text-5xl font-bold mb-4'
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='text-xl text-muted-foreground max-w-2xl mx-auto'
          >
            Choose the perfect plan for your logistics needs. All plans include a 14-day free trial.
          </motion.p>
        </div>

        <div className='grid md:grid-cols-3 gap-8 max-w-7xl mx-auto'>
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
                    ? 'border-primary shadow-lg shadow-primary/20'
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                    <span className='bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider'>
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className='text-center pb-8 pt-8'>
                  <CardTitle className='text-2xl font-bold mb-2'>{plan.name}</CardTitle>
                  <div className='mb-4'>
                    <span className='text-4xl font-bold'>{plan.price}</span>
                    <span className='text-muted-foreground'>{plan.period}</span>
                  </div>
                  <p className='text-sm text-muted-foreground'>{plan.description}</p>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <ul className='space-y-3'>
                    {plan.features.map((feature) => (
                      <li key={feature} className='flex items-start gap-3'>
                        <RiCheckLine className='size-5 text-primary shrink-0 mt-0.5' />
                        <span className='text-sm'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular ? 'btn-primary' : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href='/request-access'>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className='mt-16 text-center'>
          <p className='text-muted-foreground mb-4'>
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
          <p className='text-sm text-muted-foreground'>
            Need a custom solution?{' '}
            <Link href='/request-access' className='text-primary hover:underline'>
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
