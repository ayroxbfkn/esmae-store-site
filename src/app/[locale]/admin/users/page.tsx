import { prisma } from "@/lib/prisma/client";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";

export const metadata = { title: "Users | Esmae Admin" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string; role?: string; q?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const limit = 25;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (searchParams.role) where.role = searchParams.role;
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { email: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    }),
    prisma.user.count({ where }),
  ]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "2rem",
            fontWeight: 300,
            color: "var(--deep-luxury)",
          }}
        >
          Users
        </h1>
        <p style={{ fontSize: "0.8rem", color: "#9a8aaa", marginTop: "0.25rem" }}>
          {total} registered users
        </p>
      </div>

      <AdminUsersTable
        users={users}
        pagination={{ total, page, limit, pages: Math.ceil(total / limit) }}
      />
    </div>
  );
}
