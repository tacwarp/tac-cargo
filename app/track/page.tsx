'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function TrackSearchPage() {
  const [awb, setAwb] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanAwb = awb.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    
    if (!cleanAwb) {
      setError('Please enter an AWB number')
      return
    }

    if (cleanAwb.length < 3 || cleanAwb.length > 20) {
      setError('AWB number must be 3-20 characters')
      return
    }

    router.push(`/track/${encodeURIComponent(cleanAwb)}`)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-violet-400">
            TAC Cargo
          </Link>
          <Link 
            href="/login"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full"
        >
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Track Your Shipment</h1>
            <p className="text-zinc-400 max-w-md mx-auto">
              Enter your AWB (Air Waybill) number to get real-time tracking updates on your shipment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={awb}
                onChange={(e) => {
                  setAwb(e.target.value)
                  setError('')
                }}
                placeholder="Enter AWB number (e.g., TAC123456)"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-lg font-mono placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                autoComplete="off"
                autoFocus
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Track Shipment
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <p className="text-2xl font-bold text-violet-400">24/7</p>
              <p className="text-xs text-zinc-500 mt-1">Real-time Updates</p>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <p className="text-2xl font-bold text-violet-400">100%</p>
              <p className="text-xs text-zinc-500 mt-1">Accurate Tracking</p>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <p className="text-2xl font-bold text-violet-400">Fast</p>
              <p className="text-xs text-zinc-500 mt-1">Instant Results</p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} TAC Cargo. Imphal-Delhi Logistics Corridor.</p>
        </div>
      </footer>
    </div>
  )
}
