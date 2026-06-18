"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { ProductSchema, type ProductData } from "@/lib/validators/schemas";
import { cacheDelPattern, cacheGet, cacheSet } from "@/lib/redis/client";
import { revalidatePath } from "next/cache";

export async function getProducts(locale: string = "en") {
  const cacheKey = `products:${locale}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return { success: true, data: cached };

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    include: {
      options: { orderBy: { sortOrder: "asc" } },
    },
  });

  await cacheSet(cacheKey, products, 600);
  return { success: true, data: products };
}

export async function getProductBySlug(slug: string) {
  const cacheKey = `product:${slug}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return { success: true, data: cached };

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      options: { orderBy: [{ key: "asc" }, { sortOrder: "asc" }] },
      pricingRules: { where: { isActive: true } },
    },
  });

  if (!product) return { success: false, error: "Product not found" };

  await cacheSet(cacheKey, product, 600);
  return { success: true, data: product };
}

export async function adminCreateProduct(data: ProductData) {
  const session = await auth();
  if (!session?.user || !["SUPER_ADMIN", "STAFF"].includes(session.user.role)) {
    return { success: false, error: "Forbidden" };
  }

  const parsed = ProductSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) return { success: false, error: "Slug already exists" };

  const product = await prisma.product.create({ data: parsed.data });
  await cacheDelPattern("products:*");
  revalidatePath("/admin/products");

  return { success: true, data: product };
}

export async function adminUpdateProduct(id: string, data: Partial<ProductData>) {
  const session = await auth();
  if (!session?.user || !["SUPER_ADMIN", "STAFF"].includes(session.user.role)) {
    return { success: false, error: "Forbidden" };
  }

  const product = await prisma.product.update({
    where: { id },
    data,
  });

  await cacheDelPattern("products:*");
  await cacheDelPattern(`product:${product.slug}`);
  revalidatePath("/admin/products");

  return { success: true, data: product };
}

export async function adminDeleteProduct(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden" };
  }

  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  await cacheDelPattern("products:*");
  revalidatePath("/admin/products");

  return { success: true, data: product };
}
