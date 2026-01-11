/**
 * Type definitions for jspdf-autotable
 */

import { jsPDF } from "jspdf";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
      startY: number;
      pageNumber: number;
    };
  }
}

declare module "jspdf-autotable" {
  export interface UserOptions {
    startY?: number;
    head?: unknown[][];
    body?: unknown[][];
    foot?: unknown[][];
    theme?: "striped" | "grid" | "plain";
    headStyles?: {
      fillColor?: number[];
      textColor?: number[];
      fontSize?: number;
      fontStyle?: string;
      halign?: "left" | "center" | "right";
    };
    bodyStyles?: {
      fontSize?: number;
      fontStyle?: string;
      halign?: "left" | "center" | "right";
    };
    columnStyles?: {
      [key: number]: {
        cellWidth?: number;
        halign?: "left" | "center" | "right";
      };
    };
    margin?: {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
    };
    didParseCell?: (hookData: {
      row: { index: number };
      column: { index: number };
      cell: { styles: Record<string, unknown> };
    }) => void;
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): jsPDF;
}
