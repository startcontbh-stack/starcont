import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Painel da Start Cont",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-nevoa md:flex-row">
      <AdminNav />
      <div className="flex-1 overflow-x-hidden p-5 md:p-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
