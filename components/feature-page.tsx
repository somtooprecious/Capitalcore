import { Card } from "@/components/ui/card";

export function FeaturePage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="max-w-3xl text-muted">{description}</p>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>Analytics widget</Card>
        <Card>Action panel</Card>
        <Card>Recent activity</Card>
      </div>
    </main>
  );
}
