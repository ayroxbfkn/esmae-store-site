import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect(`/${params.locale}/sign-in?callbackUrl=/${params.locale}/dashboard`);
  }

  return (
    <>
      <Navbar />
      <main
        style={{
          paddingTop: "72px",
          minHeight: "100vh",
          background: "#faf9fc",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "3rem clamp(1rem,4vw,2.5rem)",
          }}
        >
          {children}
        </div>
      </main>
    </>
  );
}
