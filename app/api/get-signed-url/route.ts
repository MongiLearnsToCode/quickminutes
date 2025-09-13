import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key } = await req.json();

    if (!key) {
      return NextResponse.json({ error: "File key is required" }, { status: 400 });
    }

    // Optional: Check if the user has access to this file
    // For example, you could check if the key starts with the user's ID
    if (!key.startsWith(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Get signed URL error:", error);
    return NextResponse.json(
      { error: "Failed to get signed URL" },
      { status: 500 },
    );
  }
}
