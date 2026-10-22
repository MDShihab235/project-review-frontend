"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, FolderKanban, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export function StatCards() {
  const { data, isLoading } = useQuery({ queryKey: ["stats"], queryFn: api.stats, refetchInterval: 30_000 });

  const items = [
    { label: "Total", value: data?.total, icon: FolderKanban, tone: "text-slate-600", sub: `${data?.submittedLast7Days ?? 0} in last 7 days` },
    { label: "Pending", value: data?.pending, icon: Clock, tone: "text-amber-600", sub: "Awaiting review" },
    { label: "Approved", value: data?.approved, icon: CheckCircle2, tone: "text-emerald-600", sub: `${data?.approvalRate ?? 0}% approval rate` },
    { label: "Rejected", value: data?.rejected, icon: XCircle, tone: "text-red-600", sub: "Sent back with feedback" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon, tone, sub }) => (
        <Card key={label}>
          <CardContent className="flex items-start justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              {isLoading ? <Skeleton className="mt-2 h-8 w-16" /> : <p className="mt-1 text-3xl font-bold">{value ?? 0}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
            </div>
            <Icon className={`h-6 w-6 ${tone}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
