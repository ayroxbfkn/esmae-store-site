import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await auth();

  if (
    !session?.user ||
    !["SUPER_ADMIN", "STAFF"].includes(session.user.role)
  ) {
    redirect(`/${params.locale}/sign-in`);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar locale={params.locale} role={session.user.role} />
      <main className="admin-main">
        <div style={{ padding: "2rem 2.5rem" }}>{children}</div>
      </main>
    </div>
  );
}
