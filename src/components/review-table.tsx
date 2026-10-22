"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Check,
  Download,
  ExternalLink,
  GitBranch,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";
import { RejectDialog } from "@/components/reject-dialog";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { api, ApiError } from "@/lib/api";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const FILTERS: { value: ProjectStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const SORTS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "name:asc", label: "Name A-Z" },
  { value: "name:desc", label: "Name Z-A" },
];

export function ReviewTable() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<ProjectStatus | "ALL">("PENDING");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [page, setPage] = useState(1);
  const [rejecting, setRejecting] = useState<Project | null>(null);

  const search = useDebounce(searchInput.trim());
  const [sortBy, order] = sort.split(":") as [
    "createdAt" | "name",
    "asc" | "desc",
  ];

  // Any filter change goes back to page 1.
  useEffect(() => setPage(1), [status, search, sort]);

  const params = {
    page,
    limit: 10,
    status,
    search: search || undefined,
    sortBy,
    order,
  };
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["projects", "review", params],
    queryFn: () => api.listProjects(params),
    placeholderData: keepPreviousData, // server-side filtering without table flicker
  });

  const review = useMutation({
    mutationFn: (v: {
      id: string;
      status: "APPROVED" | "REJECTED";
      feedback?: string;
    }) => api.review(v.id, { status: v.status, feedback: v.feedback }),
    onSuccess: (p) => {
      toast.success(
        `"${p.name}" ${p.status === "APPROVED" ? "approved" : "rejected"}`,
      );
      setRejecting(null);
      qc.invalidateQueries({ queryKey: ["projects", "review"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e) => {
      toast.error(e instanceof ApiError ? e.message : "Review failed");
      qc.invalidateQueries({ queryKey: ["projects", "review"] }); // e.g. another mentor reviewed it first
      qc.invalidateQueries({ queryKey: ["stats"] });
      setRejecting(null);
    },
  });

  return (
    <Card>
      <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="inline-flex rounded-md border bg-muted p-1"
          role="tablist"
          aria-label="Filter by status"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={status === f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                status === f.value
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-64 pl-9"
              placeholder="Search name, repo, student..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Sort"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() =>
              api
                .exportCsv({ status, search: search || undefined })
                .catch(() => toast.error("Export failed"))
            }
          >
            <Download className="h-4 w-4" /> CSV
          </Button>
        </div>
      </div>

      <Table className={cn(isFetching && "opacity-70 transition-opacity")}>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5}>
                  <Skeleton className="h-10" />
                </TableCell>
              </TableRow>
            ))}
          {isError && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-10 text-center text-destructive"
              >
                Failed to load projects.
              </TableCell>
            </TableRow>
          )}
          {data?.items.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-10 text-center text-muted-foreground"
              >
                No projects match these filters.
              </TableCell>
            </TableRow>
          )}
          {data?.items.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="max-w-sm">
                <div className="font-medium">{p.name}</div>
                <p
                  className="line-clamp-2 text-xs text-muted-foreground"
                  title={p.description}
                >
                  {p.description}
                </p>
                <div className="mt-1 flex gap-3 text-xs">
                  <a
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitBranch className="h-3 w-3" /> Repo
                  </a>
                  <a
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" /> Live
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{p.submittedBy.name}</div>
                <div className="text-xs text-muted-foreground">
                  {p.submittedBy.email}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(p.createdAt)}
              </TableCell>
              <TableCell>
                <StatusBadge status={p.status} />
                {p.status !== "PENDING" && p.reviewedBy && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    by {p.reviewedBy.name}
                  </div>
                )}
                {p.feedback && (
                  <div
                    className="mt-1 max-w-48 truncate text-xs text-muted-foreground"
                    title={p.feedback}
                  >
                    {p.feedback}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                {p.status === "PENDING" ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="success"
                      disabled={review.isPending}
                      onClick={() =>
                        review.mutate({ id: p.id, status: "APPROVED" })
                      }
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={review.isPending}
                      onClick={() => setRejecting(p)}
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {p.reviewedAt ? formatDate(p.reviewedAt) : "-"}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data && <Pagination meta={data.meta} onChange={setPage} />}

      <RejectDialog
        project={rejecting}
        loading={review.isPending}
        onClose={() => setRejecting(null)}
        onConfirm={(feedback) =>
          rejecting &&
          review.mutate({ id: rejecting.id, status: "REJECTED", feedback })
        }
      />
    </Card>
  );
}
