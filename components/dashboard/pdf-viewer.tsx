"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  PrinterIcon,
  ZoomInIcon,
  ZoomOutIcon,
  Loader2Icon,
  FileTextIcon,
} from "lucide-react";

interface PDFViewerProps {
  url: string;
  title?: string;
  showToolbar?: boolean;
}

export function PDFViewer({
  url,
  title = "Document",
  showToolbar = true,
}: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);

  const handlePrint = () => {
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      // Wait for the PDF to load before printing
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="flex h-full flex-col">
      {showToolbar && (
        <CardHeader className="border-b pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileTextIcon className="size-4" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
              >
                <ZoomOutIcon className="size-4" />
              </Button>
              <span className="w-12 text-center font-mono text-xs">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setZoom((z) => Math.min(200, z + 10))}
              >
                <ZoomInIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={handlePrint}
              >
                <PrinterIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={handleDownload}
              >
                <DownloadIcon className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="relative flex-1 overflow-auto p-0">
        {loading && (
          <div className="bg-background/80 absolute inset-0 flex items-center justify-center">
            <Loader2Icon className="text-primary size-8 animate-spin" />
          </div>
        )}
        <iframe
          src={url}
          className="h-full min-h-[600px] w-full border-0"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top left",
          }}
          onLoad={() => setLoading(false)}
          title={title}
        />
      </CardContent>
    </Card>
  );
}
