"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CameraIcon,
  ScanBarcodeIcon,
  XIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function BarcodeScanner({
  onScan,
  placeholder = "Scan or enter barcode...",
  autoFocus = true,
}: BarcodeScannerProps) {
  const [inputValue, setInputValue] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout and camera stream on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;

    const barcode = inputValue.trim().toUpperCase();
    setLastScanned(barcode);
    setScanStatus("success");
    onScan(barcode);
    setInputValue("");

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset status after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setScanStatus("idle");
      setLastScanned(null);
    }, 2000);

    inputRef.current?.focus();
  }, [inputValue, onScan]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      setScanStatus("error");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const getStatusIcon = () => {
    switch (scanStatus) {
      case "success":
        return <CheckCircleIcon className="text-success size-4" />;
      case "error":
        return <AlertCircleIcon className="text-destructive size-4" />;
      default:
        return <ScanBarcodeIcon className="text-muted-foreground size-4" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute top-1/2 left-3 -translate-y-1/2">
            {getStatusIcon()}
          </div>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-9 font-mono"
            autoFocus={autoFocus}
          />
        </div>
        <Button onClick={handleSubmit} disabled={!inputValue.trim()}>
          Scan
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={cameraActive ? stopCamera : startCamera}
        >
          {cameraActive ? (
            <XIcon className="size-4" />
          ) : (
            <CameraIcon className="size-4" />
          )}
        </Button>
      </div>

      {cameraActive && (
        <Card className="overflow-hidden">
          <CardContent className="relative p-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="aspect-video w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="border-primary bg-primary/10 h-16 w-64 rounded-lg border-2" />
            </div>
            <p className="absolute right-0 bottom-2 left-0 bg-black/50 py-1 text-center text-xs text-white">
              Position barcode in the frame
            </p>
          </CardContent>
        </Card>
      )}

      {lastScanned && scanStatus === "success" && (
        <div className="text-success flex items-center gap-2 text-sm">
          <CheckCircleIcon className="size-4" />
          <span className="font-mono">{lastScanned}</span>
          <span className="text-muted-foreground">scanned successfully</span>
        </div>
      )}
    </div>
  );
}
