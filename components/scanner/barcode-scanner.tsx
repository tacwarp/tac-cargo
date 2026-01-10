"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    Keyboard,
    X,
    ScanLine,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface BarcodeScannerProps {
    onScan: (barcode: string) => Promise<{ success: boolean; message?: string }>;
    placeholder?: string;
    buttonLabel?: string;
    className?: string;
}

type ScanMode = "usb" | "camera" | null;
type ScanStatus = "idle" | "scanning" | "success" | "error";

export function BarcodeScanner({
    onScan,
    placeholder = "Scan or enter barcode...",
    buttonLabel = "Scan",
    className,
}: BarcodeScannerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scanMode, setScanMode] = useState<ScanMode>(null);
    const [manualInput, setManualInput] = useState("");
    const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [scanHistory, setScanHistory] = useState<Array<{ barcode: string; status: "success" | "error"; timestamp: Date }>>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // USB Scanner Input Handler - listens for rapid keystrokes
    const barcodeBuffer = useRef<string>("");
    const lastKeyTime = useRef<number>(0);

    // Define handleScan first so it can be used in handleKeyDown
    const handleScan = useCallback(async (barcode: string) => {
        if (!barcode.trim()) return;

        setScanStatus("scanning");
        setLastScanned(barcode);

        try {
            const result = await onScan(barcode.trim().toUpperCase());
            
            if (result.success) {
                setScanStatus("success");
                setScanHistory(prev => [
                    { barcode, status: "success", timestamp: new Date() },
                    ...prev.slice(0, 9)
                ]);
                toast.success(result.message || `Scanned: ${barcode}`);
            } else {
                setScanStatus("error");
                setScanHistory(prev => [
                    { barcode, status: "error", timestamp: new Date() },
                    ...prev.slice(0, 9)
                ]);
                toast.error(result.message || "Scan failed");
            }
        } catch {
            setScanStatus("error");
            toast.error("Scan processing failed");
        }

        // Reset status after animation
        setTimeout(() => setScanStatus("idle"), 1500);
        setManualInput("");
    }, [onScan]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen || scanMode !== "usb") return;

        const now = Date.now();
        const timeDiff = now - lastKeyTime.current;

        // If more than 50ms between keystrokes, reset buffer (USB scanners type fast)
        if (timeDiff > 50) {
            barcodeBuffer.current = "";
        }

        lastKeyTime.current = now;

        if (e.key === "Enter" && barcodeBuffer.current.length > 0) {
            e.preventDefault();
            handleScan(barcodeBuffer.current);
            barcodeBuffer.current = "";
        } else if (e.key.length === 1) {
            barcodeBuffer.current += e.key;
        }
    }, [isOpen, scanMode, handleScan]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Camera Scanner
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (scanMode !== "camera") {
            stopCamera();
            return;
        }

        let mounted = true;
        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });
                if (mounted) {
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                }
            } catch (err) {
                console.error("Camera access error:", err);
                toast.error("Could not access camera. Please check permissions.");
            }
        };

        initCamera();
        return () => {
            mounted = false;
            stopCamera();
        };
    }, [scanMode, stopCamera]);

    // Focus input when USB mode is selected
    useEffect(() => {
        if (scanMode === "usb" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [scanMode]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualInput.trim()) {
            handleScan(manualInput);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setScanMode(null);
        stopCamera();
    };

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className={cn("gap-2", className)}
            >
                <ScanLine className="w-4 h-4" />
                {buttonLabel}
            </Button>

            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Barcode Scanner</DialogTitle>
                        <DialogDescription>
                            Use USB scanner or camera to scan barcodes
                        </DialogDescription>
                    </DialogHeader>

                    {/* Mode Selection */}
                    {!scanMode && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <button
                                onClick={() => setScanMode("usb")}
                                className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
                            >
                                <Keyboard className="w-10 h-10 text-primary" />
                                <div className="text-center">
                                    <div className="font-medium">USB Scanner</div>
                                    <div className="text-xs text-muted-foreground">
                                        Plug in USB barcode scanner
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={() => setScanMode("camera")}
                                className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
                            >
                                <Camera className="w-10 h-10 text-primary" />
                                <div className="text-center">
                                    <div className="font-medium">Camera</div>
                                    <div className="text-xs text-muted-foreground">
                                        Use device camera
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* USB Scanner Mode */}
                    {scanMode === "usb" && (
                        <div className="space-y-4 py-4">
                            <div className="relative">
                                <AnimatePresence>
                                    {scanStatus === "scanning" && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center z-10"
                                        >
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        </motion.div>
                                    )}
                                    {scanStatus === "success" && (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-success/10 rounded-lg flex items-center justify-center z-10"
                                        >
                                            <CheckCircle className="w-8 h-8 text-success" />
                                        </motion.div>
                                    )}
                                    {scanStatus === "error" && (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-destructive/10 rounded-lg flex items-center justify-center z-10"
                                        >
                                            <AlertCircle className="w-8 h-8 text-destructive" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="p-8 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 text-center">
                                    <ScanLine className="w-12 h-12 mx-auto text-primary mb-4 animate-pulse" />
                                    <p className="text-sm font-medium text-foreground">
                                        Ready to scan
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Point USB scanner at barcode and scan
                                    </p>
                                    {lastScanned && (
                                        <p className="text-xs font-mono mt-3 text-primary">
                                            Last: {lastScanned}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Manual Input */}
                            <form onSubmit={handleManualSubmit} className="flex gap-2">
                                <Input
                                    ref={inputRef}
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    placeholder={placeholder}
                                    className="flex-1 font-mono"
                                />
                                <Button type="submit" disabled={!manualInput.trim()}>
                                    Submit
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* Camera Mode */}
                    {scanMode === "camera" && (
                        <div className="space-y-4 py-4">
                            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                {/* Scan overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-64 h-32 border-2 border-primary rounded-lg relative">
                                        <motion.div
                                            className="absolute left-0 right-0 h-0.5 bg-primary"
                                            animate={{ top: ["0%", "100%", "0%"] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {scanStatus === "success" && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-success/30 flex items-center justify-center"
                                        >
                                            <CheckCircle className="w-16 h-16 text-white" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Manual fallback for camera */}
                            <form onSubmit={handleManualSubmit} className="flex gap-2">
                                <Input
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    placeholder="Or enter barcode manually..."
                                    className="flex-1 font-mono"
                                />
                                <Button type="submit" disabled={!manualInput.trim()}>
                                    Submit
                                </Button>
                            </form>

                            <p className="text-xs text-muted-foreground text-center">
                                Camera barcode detection requires additional library integration.
                                Use manual input or USB scanner for now.
                            </p>
                        </div>
                    )}

                    {/* Scan History */}
                    {scanHistory.length > 0 && (
                        <div className="border-t pt-4">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Recent Scans
                            </h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {scanHistory.map((item, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex items-center justify-between px-2 py-1 rounded text-xs",
                                            item.status === "success" ? "bg-success/10" : "bg-destructive/10"
                                        )}
                                    >
                                        <span className="font-mono">{item.barcode}</span>
                                        <span className="text-muted-foreground">
                                            {item.timestamp.toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mode Switch */}
                    {scanMode && (
                        <div className="flex justify-between items-center pt-2 border-t">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setScanMode(null)}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Change Mode
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                Mode: {scanMode === "usb" ? "USB Scanner" : "Camera"}
                            </span>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

// Simplified inline scanner for quick access
export function InlineBarcodeInput({
    onScan,
    placeholder = "Scan or type reference...",
    className,
}: Omit<BarcodeScannerProps, "buttonLabel">) {
    const [value, setValue] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const barcodeBuffer = useRef<string>("");
    const lastKeyTime = useRef<number>(0);

    // Define handleSubmit first so it can be used in handleKeyDown
    const handleSubmit = useCallback(async () => {
        if (!value.trim()) return;

        setIsScanning(true);
        try {
            const result = await onScan(value.trim().toUpperCase());
            if (result.success) {
                toast.success(result.message || `Scanned: ${value}`);
                setValue("");
            } else {
                toast.error(result.message || "Scan failed");
            }
        } catch {
            toast.error("Scan processing failed");
        }
        setIsScanning(false);
    }, [value, onScan]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        const now = Date.now();
        const timeDiff = now - lastKeyTime.current;

        // USB scanner detection (rapid input)
        if (timeDiff < 50 && e.key !== "Enter") {
            barcodeBuffer.current += e.key;
        } else if (timeDiff >= 50) {
            barcodeBuffer.current = e.key === "Enter" ? "" : e.key;
        }

        lastKeyTime.current = now;

        if (e.key === "Enter" && value.trim()) {
            e.preventDefault();
            handleSubmit();
        }
    }, [value, handleSubmit]);

    return (
        <div className={cn("relative", className)}>
            <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="pl-10 font-mono"
                disabled={isScanning}
            />
            {isScanning && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
            )}
        </div>
    );
}
