import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { meetings } from "@/db/schema";
import { uploadAudioAssets } from "@/lib/upload-audio";
import * as mm from "music-metadata";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await mm.parseBuffer(buffer, file.type);
    const duration = metadata.format.duration || 0;

    const key = `${session.user.id}/${nanoid()}`;
    const url = await uploadAudioAssets(buffer, key);

    const [newMeeting] = await db
      .insert(meetings)
      .values({
        id: nanoid(),
        userId: session.user.id,
        filePath: url,
        duration: Math.round(duration),
        status: "uploaded",
      })
      .returning();

    return NextResponse.json({ uploadedFile: newMeeting });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload audio" },
      { status: 500 },
    );
  }
}
