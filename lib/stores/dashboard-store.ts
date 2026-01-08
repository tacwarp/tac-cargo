import { create } from "zustand";

interface DashboardState {
  isConnected: boolean;
  activeShipmentsCount: number | null;
  deliveredTodayCount: number | null;
  recentActivity: Array<{
    id: string;
    type: "shipment" | "exception" | "system";
    message: string;
    timestamp: string;
  }>;
  setConnected: (status: boolean) => void;
  updateKPI: (key: "active" | "delivered", value: number) => void;
  addActivity: (activity: DashboardState["recentActivity"][0]) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isConnected: false,
  activeShipmentsCount: null,
  deliveredTodayCount: null,
  recentActivity: [],

  setConnected: (status) => set({ isConnected: status }),

  updateKPI: (key, value) =>
    set((state) => ({
      activeShipmentsCount:
        key === "active" ? value : state.activeShipmentsCount,
      deliveredTodayCount:
        key === "delivered" ? value : state.deliveredTodayCount,
    })),

  addActivity: (activity) =>
    set((state) => ({
      recentActivity: [activity, ...state.recentActivity].slice(0, 10), // Keep last 10 events
    })),
}));
