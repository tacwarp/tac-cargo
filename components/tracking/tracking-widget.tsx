"use client"

import { useTracking } from "@/hooks/use-tracking"
import { TrackingInput } from "./tracking-input"
import { TrackingResultCard } from "./tracking-result-card"
import { TrackingSkeleton } from "./tracking-skeleton"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export function TrackingWidget() {
    const [activeId, setActiveId] = useState<string | undefined>()
    const { data, loading, error } = useTracking(activeId)

    const handleTrack = (id: string) => {
        setActiveId(id)
    }

    return (
        <div className="w-full space-y-8 z-10 relative">
            <div className="text-center space-y-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <TrackingInput onTrack={handleTrack} loading={loading} />
                </motion.div>

                {!activeId && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm text-muted-foreground"
                    >
                        Try sample AWB: <span className="font-mono text-primary cursor-pointer hover:underline" onClick={() => handleTrack('TAC-882190')}>TAC-882190</span>
                    </motion.p>
                )}
            </div>

            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <TrackingSkeleton />
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-xl mx-auto"
                    >
                        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive shadow-lg">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Tracking Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {data && !loading && !error && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <TrackingResultCard data={data} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
