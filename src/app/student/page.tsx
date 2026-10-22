"use client";

import { AuthGuard } from "@/components/auth-guard";
import { MySubmissions } from "@/components/my-submissions";
import { ProjectForm } from "@/components/project-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentPage() {
  return (
    <AuthGuard roles={["STUDENT"]}>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 lg:self-start">
          <CardHeader>
            <CardTitle>Submit a project</CardTitle>
            <CardDescription>Each repository and live link can only be submitted once.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectForm />
          </CardContent>
        </Card>
        <div className="lg:col-span-3">
          <MySubmissions />
        </div>
      </div>
    </AuthGuard>
  );
}
