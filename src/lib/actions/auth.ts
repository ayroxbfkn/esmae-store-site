"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma/client";
import { RegisterSchema, type RegisterData } from "@/lib/validators/schemas";
import { auth } from "@/lib/auth/config";
import { revalidatePath } from "next/cache";

export async function registerUser(data: RegisterData) {
  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid registration data." };
  }

  const { name, email, password, phone } = parsed.data;

  // Check uniqueness
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone ?? null,
        role: "CUSTOMER",
        locale: "en",
      },
    });

    return { success: true, data: { id: user.id, email: user.email } };
  } catch (err) {
    console.error("[RegisterUser]", err);
    return { success: false, error: "Failed to create account. Please try again." };
  }
}

export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  locale?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.locale !== undefined && { locale: data.locale }),
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: { name: user.name, locale: user.locale } };
  } catch (err) {
    console.error("[UpdateProfile]", err);
    return { success: false, error: "Failed to update profile." };
  }
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  if (data.newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    return { success: false, error: "Password change not available for OAuth accounts." };
  }

  const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Current password is incorrect." };
  }

  const newHash = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newHash },
  });

  return { success: true };
}

// B2B feature removed.
