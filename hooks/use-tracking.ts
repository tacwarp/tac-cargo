import { useCallback, useEffect, useRef, useState } from "react";
import { TrackingPayload } from "@/types/tracking";

// Terminal statuses that should stop polling
const TERMINAL_STATUSES = [
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "FAILED",
] as const;

export function useTracking(trackingId?: string) {
  const [data, setData] = useState<TrackingPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const intervalControllers = useRef<Set<AbortController>>(new Set());

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      if (!trackingId) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/tracking?trackingId=${encodeURIComponent(trackingId)}`,
          { signal },
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (json.success) {
          setData(json.data);

          // auto-stop polling on terminal statuses
          if (TERMINAL_STATUSES.includes(json.data.status)) {
            if (timer.current) clearInterval(timer.current);
            // Abort any pending interval requests
            intervalControllers.current.forEach((c) => c.abort());
            intervalControllers.current.clear();
          }
        } else {
          setError(json.error || "Failed to fetch tracking data");
          setData(null);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Network error or invalid response");
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [trackingId],
  );

  useEffect(() => {
    const controller = new AbortController();
    const controllers = intervalControllers.current;

    if (trackingId) {
      fetchData(controller.signal);
      timer.current = setInterval(() => {
        // Create new controller for each interval fetch and track it
        const intervalController = new AbortController();
        intervalControllers.current.add(intervalController);

        fetchData(intervalController.signal).finally(() => {
          // Remove controller after fetch completes
          intervalControllers.current.delete(intervalController);
        });
      }, 30000);
    }

    return () => {
      controller.abort();
      if (timer.current) clearInterval(timer.current);
      // Abort all pending interval requests on cleanup
      controllers.forEach((c) => c.abort());
      controllers.clear();
    };
  }, [trackingId, fetchData]);

  return { data, loading, error, refetch: fetchData };
}
