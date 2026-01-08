"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, MapPin, Package, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Shipment {
  id: string;
  reference: string;
  status: string;
  sla_status?: string;
  sla_target?: string;
  consignee_name: string;
  consignee_city: string;
  weight_kg: number;
  pieces: number;
  created_at: string;
  customers?: { name: string };
}

interface ShipmentsTableProps {
  shipments: Shipment[];
  loading?: boolean;
}

export function ShipmentsTable({ shipments, loading }: ShipmentsTableProps) {
  const [search, setSearch] = useState("");

  const filteredShipments = shipments?.filter(
    (shipment) =>
      shipment.reference.toLowerCase().includes(search.toLowerCase()) ||
      shipment.consignee_name.toLowerCase().includes(search.toLowerCase()),
  );

  const getStatusVariant = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      picked_up: "default",
      in_transit: "default",
      out_for_delivery: "default",
      delivered: "outline",
      cancelled: "destructive",
    };
    return variants[status] || "default";
  };

  const getSLAVariant = (slaStatus?: string) => {
    if (slaStatus === "at_risk") return "destructive";
    if (slaStatus === "breached") return "outline";
    return "default";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-muted h-10 animate-pulse rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-muted h-16 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by reference or consignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Consignee</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-muted-foreground text-center"
                >
                  No shipments found
                </TableCell>
              </TableRow>
            ) : (
              filteredShipments?.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">
                    {shipment.reference}
                  </TableCell>
                  <TableCell>{shipment.customers?.name || "-"}</TableCell>
                  <TableCell>{shipment.consignee_name}</TableCell>
                  <TableCell>
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {shipment.consignee_city}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <Package className="h-3 w-3" />
                      {shipment.pieces} pcs, {shipment.weight_kg} kg
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(shipment.status)}>
                      {shipment.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {shipment.sla_target && (
                      <Badge variant={getSLAVariant(shipment.sla_status)}>
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDistanceToNow(new Date(shipment.sla_target), {
                          addSuffix: true,
                        })}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(shipment.created_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/shipments/${shipment.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
