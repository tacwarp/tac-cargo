"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ScanBarcode } from "lucide-react"

interface TrackingInputProps {
    onTrack: (id: string) => void
    loading: boolean
}

export function TrackingInput({ onTrack, loading }: TrackingInputProps) {
    const [value, setValue] = useState("")

    const handleSubmit = () => {
        const trimmedValue = value.trim()
        if (trimmedValue && !loading) onTrack(trimmedValue)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto">
            <div className="relative flex-1">
                <Input
                    placeholder="Enter Tracking / AWB Number"
                    value={value}
                    onChange={(e) => setValue(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !loading) handleSubmit()
                    }}
                    className="h-12 pl-12 pr-12 bg-background border-input transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Scan Barcode (Simulated)"
                >
                    <ScanBarcode className="h-4 w-4" />
                </Button>
            </div>
            <Button
                className="h-12 px-8 font-medium shadow-lg hover:shadow-primary/25 transition-all"
                disabled={!value || loading}
                onClick={handleSubmit}
            >
                Track Shipment
            </Button>
        </div>
    )
}
