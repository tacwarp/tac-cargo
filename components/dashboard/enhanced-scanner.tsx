"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Camera, 
  Keyboard, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  X,
  Scan
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ScanResult {
  barcode: string;
  timestamp: Date;
  success: boolean;
  message?: string;
}

interface EnhancedScannerProps {
  onScan: (barcode: string) => Promise<{ success: boolean; message?: string }>;
  placeholder?: string;
  autoFocus?: boolean;
  enableSound?: boolean;
  enableVibration?: boolean;
}

export function EnhancedScanner({
  onScan,
  placeholder = "Scan or enter barcode...",
  autoFocus = true,
  enableSound = true,
  enableVibration = true,
}: EnhancedScannerProps) {
  const [mode, setMode] = useState<"keyboard" | "camera">("keyboard");
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Create audio elements for feedback
    successAudioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVlgktPHnlkWGJGax6d5WVJXhKi/pmReSEJQWJu5v5RoU0E8Q0VcoLm3gmlXQD9CQVOgt7SmZ1lCQ0VGQl2hubSZZVlERklJRl2gua+TYlhFR0xLSV+frq2NXlZGR0xNT2Chr6iGV1NGSE5PUWOirqWAUVJGSU9RU2airqR+TVFGSlBSVWajrqJ7SVBGSlFTV2mjr599RU9GS1FUWWqksJ13Qk5HS1JVXGyls5pyP0xIS1NXX26mtpdsPEpITFRZYXCntpVoOkhITVVaY3KouJNkN0ZITlZcZXSpu5FfNERIUFddZ3aru49bMUJIUVhfaXutvY1YLkBIUllhbH2uwIpUKz5IU1pjboGwwohQKDxIVFtlcIOyxIZMJTpIVV1ndoW0xoRIIjhIVl5pd4e2yIJEHzZIV2BseYm5yoBBHTRIWGFtfIu7zH4+GjJIWWJvfY29zns6FzBIWmRxgJC/0Hg3FDBIZ2Z0g5LB0nY0Ey9IaWd1hZTD1HMxEi5IaWl3h5bF1nAuES1Iamh5iZjH2G0rECxIbGp7i5vJ2morDytIbWx8jZ3L3GgnDSpIbm1+j5/N3mYlCylIcG6Akv/a/w==");
    errorAudioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACA//+A//+A//+A/wCAwP8AgMD/AIDA/wCAwP8AgED/AIBA/wCAQP8AgED/AIAg/wCAIP8AgCD/AIAg/wCAEP8AgBD/AIAQ/wCAEP8AgAj/AIAG");
  }, [autoFocus]);

  const playSound = useCallback((success: boolean) => {
    if (!soundEnabled) return;
    const audio = success ? successAudioRef.current : errorAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [soundEnabled]);

  const vibrate = useCallback((success: boolean) => {
    if (!enableVibration || !navigator.vibrate) return;
    navigator.vibrate(success ? [100] : [100, 50, 100]);
  }, [enableVibration]);

  const handleScan = useCallback(async (barcode: string) => {
    if (!barcode.trim() || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await onScan(barcode.trim());
      const scanResult: ScanResult = {
        barcode: barcode.trim(),
        timestamp: new Date(),
        success: result.success,
        message: result.message,
      };
      
      setLastResult(scanResult);
      setRecentScans(prev => [scanResult, ...prev.slice(0, 9)]);
      playSound(result.success);
      vibrate(result.success);
      
      if (result.success) {
        setInputValue("");
      }
    } catch {
      const scanResult: ScanResult = {
        barcode: barcode.trim(),
        timestamp: new Date(),
        success: false,
        message: "Scan failed",
      };
      setLastResult(scanResult);
      playSound(false);
      vibrate(false);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  }, [isProcessing, onScan, playSound, vibrate]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleScan(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Scanner header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Scan className="w-5 h-5 text-primary" />
            {isProcessing && (
              <div className="absolute inset-0 animate-ping">
                <Scan className="w-5 h-5 text-primary opacity-50" />
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-foreground">Barcode Scanner</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-8 w-8 p-0"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            ) : (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
          
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setMode("keyboard")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                mode === "keyboard"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-muted"
              )}
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode("camera")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                mode === "camera"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-muted"
              )}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scanner input */}
      {mode === "keyboard" && (
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isProcessing}
            className={cn(
              "h-14 text-lg font-mono pr-24 transition-all",
              lastResult?.success === true && "border-emerald-500 ring-2 ring-emerald-500/20",
              lastResult?.success === false && "border-red-500 ring-2 ring-red-500/20"
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {inputValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputValue("")}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={() => handleScan(inputValue)}
              disabled={!inputValue.trim() || isProcessing}
              size="sm"
              className="h-10"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Scan"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Camera mode placeholder */}
      {mode === "camera" && (
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Camera scanning coming soon</p>
            <p className="text-xs mt-1">Use keyboard mode for now</p>
          </div>
          
          {/* Scanner frame overlay */}
          <div className="absolute inset-8 border-2 border-dashed border-primary/30 rounded-lg">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
          </div>
        </div>
      )}

      {/* Last result indicator */}
      {lastResult && (
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg transition-all",
          lastResult.success
            ? "bg-emerald-500/10 border border-emerald-500/20"
            : "bg-red-500/10 border border-red-500/20"
        )}>
          {lastResult.success ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className={cn(
              "text-sm font-mono truncate",
              lastResult.success ? "text-emerald-600" : "text-red-600"
            )}>
              {lastResult.barcode}
            </div>
            {lastResult.message && (
              <div className="text-xs text-muted-foreground">{lastResult.message}</div>
            )}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {lastResult.timestamp.toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Recent scans */}
      {recentScans.length > 1 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">Recent Scans</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {recentScans.slice(1).map((scan, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded bg-muted/50 text-xs"
              >
                {scan.success ? (
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-red-500" />
                )}
                <span className="font-mono text-muted-foreground truncate flex-1">
                  {scan.barcode}
                </span>
                <span className="text-muted-foreground">
                  {scan.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
