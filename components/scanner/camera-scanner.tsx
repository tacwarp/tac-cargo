"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { Camera, CameraOff, SwitchCamera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CameraScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
  className?: string;
  scannerConfig?: {
    fps?: number;
    qrbox?: { width: number; height: number };
    aspectRatio?: number;
  };
}

type CameraDevice = {
  id: string;
  label: string;
};

export function CameraScanner({
  onScan,
  onError,
  className,
  scannerConfig = {
    fps: 10,
    qrbox: { width: 280, height: 150 },
    aspectRatio: 1.777778,
  },
}: CameraScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  // Debounce scan results to prevent rapid duplicate scans
  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      if (decodedText !== lastScannedCode) {
        setLastScannedCode(decodedText);
        onScan(decodedText);
        
        // Reset after 2 seconds to allow same code to be scanned again
        setTimeout(() => setLastScannedCode(null), 2000);
      }
    },
    [lastScannedCode, onScan]
  );

  // Initialize camera list on mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back camera on mobile
          const backCameraIndex = devices.findIndex(
            (d) =>
              d.label.toLowerCase().includes("back") ||
              d.label.toLowerCase().includes("rear")
          );
          if (backCameraIndex !== -1) {
            setCurrentCameraIndex(backCameraIndex);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to get cameras:", err);
        setError("Camera access denied or not available");
        onError?.("Camera access denied or not available");
      });

    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          scannerRef.current.stop().catch(console.error);
        }
      }
    };
  }, [onError]);

  const startScanning = async () => {
    if (!cameras.length) {
      setError("No cameras available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("camera-scanner-container");
      }

      const camera = cameras[currentCameraIndex];

      await scannerRef.current.start(
        camera.id,
        {
          fps: scannerConfig.fps,
          qrbox: scannerConfig.qrbox,
          aspectRatio: scannerConfig.aspectRatio,
        },
        handleScanSuccess,
        () => {} // Ignore scan failures (no code detected)
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setError("Failed to start camera. Please check permissions.");
      onError?.("Failed to start camera");
    } finally {
      setIsLoading(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
    setIsScanning(false);
  };

  const switchCamera = async () => {
    if (cameras.length < 2) return;

    await stopScanning();
    const nextIndex = (currentCameraIndex + 1) % cameras.length;
    setCurrentCameraIndex(nextIndex);

    // Restart with new camera after a short delay
    setTimeout(() => {
      startScanning();
    }, 100);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Scanner Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg bg-black"
        style={{ minHeight: isScanning ? "280px" : "180px" }}
      >
        <div
          id="camera-scanner-container"
          className={cn(
            "w-full h-full",
            !isScanning && "hidden"
          )}
        />

        {/* Placeholder when not scanning */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted/50">
            {isLoading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Starting camera...
                </span>
              </>
            ) : error ? (
              <>
                <CameraOff className="w-8 h-8 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </>
            ) : (
              <>
                <Camera className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Camera ready
                </span>
              </>
            )}
          </div>
        )}

        {/* Scan overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-2 border-primary/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[150px] border-2 border-primary rounded">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-3">
        {isScanning ? (
          <>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={stopScanning}
            >
              <CameraOff className="w-4 h-4" />
              Stop Camera
            </Button>
            {cameras.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={switchCamera}
                title="Switch Camera"
              >
                <SwitchCamera className="w-4 h-4" />
              </Button>
            )}
          </>
        ) : (
          <Button
            className="flex-1 gap-2"
            onClick={startScanning}
            disabled={isLoading || cameras.length === 0}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            Start Camera Scan
          </Button>
        )}
      </div>

      {/* Camera info */}
      {isScanning && cameras[currentCameraIndex] && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Using: {cameras[currentCameraIndex].label || `Camera ${currentCameraIndex + 1}`}
        </div>
      )}
    </div>
  );
}

export default CameraScanner;
