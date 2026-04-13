import type { Metadata } from "next";
import AdminForm from "@/components/AdminForm";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin — Content Engine",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Content Engine
        </h1>
        <p className="text-muted mb-8">
          Drop insights from X, links, or raw ideas. The agents handle the rest.
        </p>

        <AdminForm />
        <AdminDashboard />
      </div>
    </main>
  );
}
