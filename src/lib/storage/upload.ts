import crypto from "crypto";
import path from "path";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/postscript", // .ai, .eps
  "image/png",
  "image/jpeg",
  "image/tiff",
  "application/x-photoshop",
  "image/vnd.adobe.photoshop",
]);

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export function validateUploadFile(file: {
  name: string;
  size: number;
  type: string;
}): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be under 100MB." };
  }

  const ext = path.extname(file.name).toLowerCase();
  const allowedExts = [".pdf", ".ai", ".eps", ".psd", ".png", ".jpg", ".jpeg", ".tiff"];
  if (!allowedExts.includes(ext)) {
    return {
      valid: false,
      error: `File type not allowed. Accepted: ${allowedExts.join(", ")}`,
    };
  }

  return { valid: true };
}

export function generateUploadKey(
  prefix: string,
  originalName: string
): string {
  const ext = path.extname(originalName);
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now();
  return `${prefix}/${timestamp}-${uniqueId}${ext}`;
}

// Presigned URL generation for S3-compatible storage
export async function generatePresignedUploadUrl(key: string): Promise<{
  uploadUrl: string;
  publicUrl: string;
}> {
  // In production, use AWS SDK or compatible S3 client
  // This is a placeholder that shows the pattern
  const endpoint =
    process.env.S3_ENDPOINT ||
    `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com`;

  // For production implementation:
  // const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  // const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
  // const client = new S3Client({ region: process.env.S3_REGION, credentials: { ... } });
  // const command = new PutObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key });
  // const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });

  const publicUrl = `${endpoint}/${key}`;

  return {
    uploadUrl: `/api/upload?key=${encodeURIComponent(key)}`, // local proxy in dev
    publicUrl,
  };
}
