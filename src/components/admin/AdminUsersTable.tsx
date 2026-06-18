"use client";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  locale: string;
  createdAt: Date;
  _count: { orders: number };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "#7b1fa2",
  STAFF: "#1565c0",
  CUSTOMER: "#78909c",
};

export function AdminUsersTable({
  users,
  pagination,
}: {
  users: User[];
  pagination: Pagination;
}) {
  return (
    <div>
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--primary-20)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf9fc" }}>
                {["User", "Role", "Company", "Orders", "Locale", "Joined"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.8rem 1.25rem",
                      textAlign: "left",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#9a8aaa",
                      borderBottom: "1px solid var(--primary-20)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: "1px solid rgba(101,76,142,0.06)" }}
                >
                  <td style={{ padding: "0.9rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "var(--primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {(user.name?.[0] ?? user.email[0]).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--deep-luxury)" }}>
                          {user.name ?? "—"}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "#9a8aaa" }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem" }}>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "2px",
                        color: "#fff",
                        background: ROLE_COLORS[user.role] ?? "#78909c",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.75rem", color: "#7a6b8a" }}>
                    —
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.78rem", color: "#7a6b8a", textAlign: "center" }}>
                    {user._count.orders}
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem" }}>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "2px",
                        background: "var(--light-section)",
                        color: "var(--primary)",
                        textTransform: "uppercase",
                      }}
                    >
                      {user.locale}
                    </span>
                  </td>
                  <td style={{ padding: "0.9rem 1.25rem", fontSize: "0.72rem", color: "#9a8aaa" }}>
                    {new Date(user.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1.5rem",
        }}
      >
        <div style={{ fontSize: "0.75rem", color: "#9a8aaa" }}>
          {pagination.total} users total
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {pagination.page > 1 && (
            <a
              href={`?page=${pagination.page - 1}`}
              style={{
                padding: "0.4rem 0.8rem",
                border: "1px solid var(--primary-20)",
                borderRadius: "2px",
                fontSize: "0.72rem",
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              ← Prev
            </a>
          )}
          {pagination.page < pagination.pages && (
            <a
              href={`?page=${pagination.page + 1}`}
              style={{
                padding: "0.4rem 0.8rem",
                border: "1px solid var(--primary-20)",
                borderRadius: "2px",
                fontSize: "0.72rem",
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              Next →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
