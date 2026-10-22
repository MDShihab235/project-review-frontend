"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, ApiError } from "@/lib/api";
import type { Project } from "@/lib/types";
import { projectSchema, type ProjectFormValues } from "@/lib/validators";

const FIELDS: (keyof ProjectFormValues)[] = ["name", "repoUrl", "liveUrl", "description"];

export function ProjectForm({ initial, onSuccess }: { initial?: Project; onSuccess?: () => void }) {
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initial?.name ?? "",
      repoUrl: initial?.repoUrl ?? "",
      liveUrl: initial?.liveUrl ?? "",
      description: initial?.description ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (v: ProjectFormValues) => (initial ? api.updateProject(initial.id, v) : api.createProject(v)),
    onSuccess: () => {
      toast.success(initial ? "Project updated and sent for review again" : "Project submitted for review");
      qc.invalidateQueries({ queryKey: ["projects", "mine"] });
      if (!initial) reset();
      onSuccess?.();
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        err.errors?.forEach((e) => {
          const field = e.field as keyof ProjectFormValues;
          if (FIELDS.includes(field)) setError(field, { message: err.status === 409 ? err.message : e.message });
        });
        toast.error(err.message);
      } else toast.error("Something went wrong. Please try again.");
    },
  });

  const descLength = watch("description")?.length ?? 0;

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
      <FormField label="Project name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" placeholder="My awesome project" aria-invalid={!!errors.name} {...register("name")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Repository URL" htmlFor="repoUrl" error={errors.repoUrl?.message}>
          <Input id="repoUrl" placeholder="https://github.com/user/repo" aria-invalid={!!errors.repoUrl} {...register("repoUrl")} />
        </FormField>
        <FormField label="Live link" htmlFor="liveUrl" error={errors.liveUrl?.message}>
          <Input id="liveUrl" placeholder="https://my-project.vercel.app" aria-invalid={!!errors.liveUrl} {...register("liveUrl")} />
        </FormField>
      </div>
      <FormField label="Description" htmlFor="description" error={errors.description?.message} hint={`${descLength}/1000`}>
        <Textarea id="description" rows={5} placeholder="What does it do, and what did you build it with?" aria-invalid={!!errors.description} {...register("description")} />
      </FormField>
      <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {initial ? "Save and resubmit" : "Submit project"}
      </Button>
    </form>
  );
}
