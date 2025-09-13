import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { meetings, summaries, transcripts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteAudioAssets } from "@/lib/upload-audio";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meetingId } = await req.json();

    if (!meetingId) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 },
      );
    }

    const [meeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, meetingId));

    if (!meeting || meeting.userId !== session.user.id) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await deleteAudioAssets(meeting.filePath);

    await db.delete(summaries).where(eq(summaries.meetingId, meetingId));
    await db.delete(transcripts).where(eq(transcripts.meetingId, meetingId));
    await db.delete(meetings).where(eq(meetings.id, meetingId));

    return NextResponse.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Delete meeting error:", error);
    return NextResponse.json(
      { error: "Failed to delete meeting" },
      { status: 500 },
    );
  }
}
