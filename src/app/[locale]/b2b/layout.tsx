import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { B2BSidebar } from "@/components/b2b/B2BSidebar";

export default async function B2BLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/${params.locale}/sign-in?callbackUrl=/${params.locale}/b2b`);
  }

  if (
    !["B2B_CLIENT", "SUPER_ADMIN", "STAFF"].includes(session.user.role)
  ) {
    redirect(`/${params.locale}`);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <B2BSidebar locale={params.locale} user={session.user} />
      <main
        style={{
          marginLeft: "240px",
          flex: 1,
          minHeight: "100vh",
          background: "#faf9fc",
          padding: "2rem 2.5rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}
