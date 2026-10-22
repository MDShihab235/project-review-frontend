"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ExternalLink, GitBranch, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";
import { ProjectForm } from "@/components/project-form";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ApiError } from "@/lib/api";
import type { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function MySubmissions() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Project | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects", "mine", page],
    queryFn: () => api.myProjects({ page, limit: 5 }),
    placeholderData: keepPreviousData,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => {
      toast.success("Submission deleted");
      qc.invalidateQueries({ queryKey: ["projects", "mine"] });
    },
    onError: (e) =>
      toast.error(e instanceof ApiError ? e.message : "Could not delete"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>My submissions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && (
          <div className="space-y-3 p-6 pt-0">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        )}
        {isError && (
          <p className="p-6 pt-0 text-sm text-destructive">
            Could not load your submissions.
          </p>
        )}
        {data && data.items.length === 0 && (
          <p className="p-6 pt-0 text-sm text-muted-foreground">
            You haven&apos;t submitted anything yet.
          </p>
        )}
        <ul className="divide-y">
          {data?.items.map((p) => (
            <li key={p.id} className="space-y-2 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.name}</span>
                  <StatusBadge status={p.status} />
                </div>
                <span className="text-xs text-muted-foreground">
                  Submitted {formatDate(p.createdAt)}
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                  href={p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitBranch className="h-3.5 w-3.5" /> Repository
                </a>
                <a
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Live
                </a>
              </div>
              {p.status === "REJECTED" && p.feedback && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                  <span className="font-medium">Mentor feedback:</span>{" "}
                  {p.feedback}
                </div>
              )}
              {p.status !== "APPROVED" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(p)}
                  >
                    <Pencil className="h-3.5 w-3.5" />{" "}
                    {p.status === "REJECTED" ? "Fix & resubmit" : "Edit"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={remove.isPending}
                    onClick={() =>
                      confirm(`Delete "${p.name}"?`) && remove.mutate(p.id)
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {data && data.meta.totalPages > 1 && (
          <Pagination meta={data.meta} onChange={setPage} />
        )}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit submission</DialogTitle>
            <DialogDescription>
              Saving sends the project back into the review queue.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <ProjectForm initial={editing} onSuccess={() => setEditing(null)} />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
