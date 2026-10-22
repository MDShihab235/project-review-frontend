"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/lib/types";

export function RejectDialog({
  project,
  loading,
  onClose,
  onConfirm,
}: {
  project: Project | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: (feedback: string) => void;
}) {
  const [feedback, setFeedback] = useState("");
  const valid = feedback.trim().length >= 5;

  return (
    <Dialog
      open={!!project}
      onOpenChange={(open) => {
        if (!open) {
          setFeedback("");
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject &ldquo;{project?.name}&rdquo;</DialogTitle>
          <DialogDescription>Tell the student what to fix. They can edit and resubmit.</DialogDescription>
        </DialogHeader>
        <Textarea
          autoFocus
          rows={4}
          maxLength={500}
          placeholder="e.g. The live link returns a 404 and the README is missing setup steps."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!valid || loading}
            onClick={() => {
              onConfirm(feedback.trim());
              setFeedback("");
            }}
          >
            Reject project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
