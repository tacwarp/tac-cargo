'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Plane,
  Building2
} from 'lucide-react'
import Link from 'next/link'

interface TrackingEvent {
  id: string
  scan_type: string
  scanned_at: string
  location: { code: string; city: string } | null
  remarks: string | null
}

interface ShipmentData {
  reference: string
  status: string
  transport_mode: string
  weight: number
  pieces: number
  description: string
  eta: string | null
  delivered_at: string | null
  created_at: string
  origin: { code: string; city: string; state: string } | null
  destination: { code: string; city: string; state: string } | null
}

interface TrackingResponse {
  shipment: ShipmentData
  events: TrackingEvent[]
  error?: string
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: 'Pending', color: 'text-amber-500', icon: Clock },
  booked: { label: 'Booked', color: 'text-blue-500', icon: Package },
  picked_up: { label: 'Picked Up', color: 'text-indigo-500', icon: Truck },
  in_transit: { label: 'In Transit', color: 'text-violet-500', icon: Plane },
  at_hub: { label: 'At Hub', color: 'text-purple-500', icon: Building2 },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-cyan-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-emerald-500', icon: CheckCircle2 },
  exception: { label: 'Exception', color: 'text-red-500', icon: AlertCircle },
}

export default function TrackingPage() {
  const params = useParams()
  const awb = params.awb as string
  const [data, setData] = useState<TrackingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTracking() {
      try {
        const response = await fetch(`/api/track?awb=${encodeURIComponent(awb)}`)
        const result = await response.json()
        
        if (!response.ok) {
          setError(result.error || 'Failed to fetch tracking information')
          return
        }
        
        setData(result)
      } catch {
        setError('Failed to connect to tracking service')
      } finally {
        setLoading(false)
      }
    }

    if (awb) {
      fetchTracking()
    }
  }, [awb])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading tracking information...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 text-center border border-zinc-800"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Shipment Not Found</h1>
          <p className="text-zinc-400 mb-6">{error || 'Unable to find tracking information for this AWB number.'}</p>
          <p className="text-sm text-zinc-500 font-mono mb-8">{awb}</p>
          <Link 
            href="/track"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Try another AWB
          </Link>
        </motion.div>
      </div>
    )
  }

  const { shipment, events } = data
  const status = statusConfig[shipment.status] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-violet-400">
            TAC Cargo
          </Link>
          <Link 
            href="/track"
            className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            New Search
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">AWB Number</p>
                  <p className="text-2xl font-mono font-semibold">{shipment.reference}</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="font-medium">{status.label}</span>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Origin</p>
                    <p className="font-medium">{shipment.origin?.city || 'N/A'}</p>
                    <p className="text-sm text-zinc-400">{shipment.origin?.state}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Destination</p>
                    <p className="font-medium">{shipment.destination?.city || 'N/A'}</p>
                    <p className="text-sm text-zinc-400">{shipment.destination?.state}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Weight</p>
                  <p className="text-lg font-semibold">{shipment.weight} kg</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Pieces</p>
                  <p className="text-lg font-semibold">{shipment.pieces}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4 col-span-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Mode</p>
                  <p className="text-lg font-semibold capitalize">{shipment.transport_mode}</p>
                </div>
              </div>
            </div>

            {shipment.eta && shipment.status !== 'delivered' && (
              <div className="px-6 pb-6">
                <div className="bg-violet-500/10 rounded-xl p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-sm text-zinc-400">Estimated Delivery</p>
                    <p className="font-medium text-violet-300">
                      {new Date(shipment.eta).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {shipment.delivered_at && (
              <div className="px-6 pb-6">
                <div className="bg-emerald-500/10 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-zinc-400">Delivered On</p>
                    <p className="font-medium text-emerald-300">
                      {new Date(shipment.delivered_at).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-lg font-semibold mb-6">Tracking History</h2>
            
            {events.length === 0 ? (
              <p className="text-zinc-400 text-center py-8">No tracking events yet</p>
            ) : (
              <div className="space-y-0">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 pb-8 last:pb-0"
                  >
                    <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-violet-500 border-4 border-zinc-900" />
                    {index !== events.length - 1 && (
                      <div className="absolute left-[7px] top-4 w-0.5 h-full bg-zinc-700" />
                    )}
                    <div>
                      <p className="font-medium capitalize">{event.scan_type?.replace(/_/g, ' ') || 'Update'}</p>
                      {event.location && (
                        <p className="text-sm text-zinc-400">{event.location.city}</p>
                      )}
                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(event.scanned_at).toLocaleString('en-IN')}
                      </p>
                      {event.remarks && (
                        <p className="text-sm text-zinc-400 mt-2">{event.remarks}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-zinc-800 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} TAC Cargo. All rights reserved.</p>
          <p className="mt-1">Imphal-Delhi Logistics Corridor</p>
        </div>
      </footer>
    </div>
  )
}
