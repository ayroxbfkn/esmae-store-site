"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { generateOrderNumber } from "@/lib/pricing/engine";
import { cacheDel } from "@/lib/redis/client";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getMyOrders() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      statusLog: { orderBy: { createdAt: "asc" } },
      invoice: true,
    },
  });

  return { success: true, data: orders };
}

export async function getOrderById(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      statusLog: { orderBy: { createdAt: "asc" } },
      invoice: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });

  if (!order) return { success: false, error: "Order not found" };

  // Only the owner or admin/staff can view
  const canView =
    order.userId === session.user.id ||
    ["SUPER_ADMIN", "STAFF"].includes(session.user.role);

  if (!canView) return { success: false, error: "Forbidden" };

  return { success: true, data: order };
}

// ─── Admin actions ───────────────────────────────────────────────────────────

export async function adminGetAllOrders(filters?: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}) {
  const session = await auth();
  if (
    !session?.user ||
    !["SUPER_ADMIN", "STAFF"].includes(session.user.role)
  ) {
    return { success: false, error: "Forbidden" };
  }

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const skip = (page - 1) * limit;

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where: filters?.status ? { status: filters.status } : undefined,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { nameEn: true } } } },
        invoice: true,
      },
    }),
    prisma.order.count({
      where: filters?.status ? { status: filters.status } : undefined,
    }),
  ]);

  return {
    success: true,
    data: orders,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  };
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string
) {
  const session = await auth();
  if (
    !session?.user ||
    !["SUPER_ADMIN", "STAFF"].includes(session.user.role)
  ) {
    return { success: false, error: "Forbidden" };
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : undefined,
      statusLog: {
        create: {
          status,
          note: note ?? null,
          createdBy: session.user.id,
        },
      },
    },
  });

  await cacheDel(`order:${orderId}`);
  revalidatePath("/admin/orders");

  return { success: true, data: order };
}

export async function adminGetDashboardStats() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden" };
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    monthOrders,
    totalRevenue,
    monthRevenue,
    pendingOrders,
    totalUsers,
  ] = await prisma.$transaction([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.aggregate({
      where: { status: "COMPLETED" },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    prisma.order.count({
      where: { status: { in: ["PENDING", "CONFIRMED", "IN_PRODUCTION"] } },
    }),
    prisma.user.count(),
  ]);

  return {
    success: true,
    data: {
      totalOrders,
      monthOrders,
      totalRevenue: Number(totalRevenue._sum.total ?? 0),
      monthRevenue: Number(monthRevenue._sum.total ?? 0),
      pendingOrders,
      totalUsers,
    },
  };
}
