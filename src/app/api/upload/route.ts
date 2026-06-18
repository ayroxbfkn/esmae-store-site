import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { validateUploadFile, generateUploadKey } from "@/lib/storage/upload";
import crypto from "crypto";

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate
  const validation = validateUploadFile({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 422 });
  }

  try {
    const key = generateUploadKey(
      `uploads/${session.user.id}`,
      file.name
    );

    // In production: upload to S3/R2/Cloudflare here
    // For now, return the key and a mock URL
    // const bytes = await file.arrayBuffer();
    // await uploadToS3(key, Buffer.from(bytes), file.type);

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/files/${key}`;

    return NextResponse.json({
      success: true,
      data: { key, url: publicUrl, name: file.name, size: file.size },
    });
  } catch (err) {
    console.error("[Upload]", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
