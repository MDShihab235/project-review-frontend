import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/types";

const map = {
  PENDING: { variant: "pending", label: "Pending" },
  APPROVED: { variant: "approved", label: "Approved" },
  REJECTED: { variant: "rejected", label: "Rejected" },
} as const;

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
