import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Paginated } from "@/lib/types";

export function Pagination({ meta, onChange }: { meta: Paginated<unknown>["meta"]; onChange: (page: number) => void }) {
  const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);
  return (
    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
      <span>
        {from}-{to} of {meta.total}
      </span>
      <div className="flex items-center gap-2">
        <span>
          Page {meta.page} of {meta.totalPages}
        </span>
        <Button variant="outline" size="icon" disabled={meta.page <= 1} onClick={() => onChange(meta.page - 1)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" disabled={meta.page >= meta.totalPages} onClick={() => onChange(meta.page + 1)} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
