import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { meetings, transcripts } from "@/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { nanoid } from "nanoid";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    await db
      .update(meetings)
      .set({ status: "transcribing" })
      .where(eq(meetings.id, meetingId));

    const audioFile = await fetch(meeting.filePath);
    const audioBlob = await audioFile.blob();

    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBlob], "audio.mp3", { type: "audio/mpeg" }),
      model: "whisper-1",
    });

    await db.insert(transcripts).values({
      id: nanoid(),
      meetingId: meeting.id,
      text: transcription.text,
    });

    await db
      .update(meetings)
      .set({ status: "transcribed" })
      .where(eq(meetings.id, meetingId));

    return NextResponse.json({ message: "Transcription complete" });
  } catch (error) {
    console.error("Transcription error:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to transcribe audio", details: errorMessage },
      { status: 500 },
    );
  }
}
