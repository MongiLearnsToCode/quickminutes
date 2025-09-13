import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { meetings, summaries, transcripts } from "@/db/schema";
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

    const [transcript] = await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.meetingId, meetingId));

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 },
      );
    }

    await db
      .update(meetings)
      .set({ status: "summarizing" })
      .where(eq(meetings.id, meetingId));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes meeting transcripts. Provide a summary and a list of action items.",
        },
        {
          role: "user",
          content: `Please summarize the following transcript and provide a list of action items:\n\n${transcript.text}`,
        },
      ],
    });

    const summaryText = completion.choices[0].message.content || "";

    // A simple way to separate summary and action items
    const [summary, actionItems] = summaryText.split("Action Items:");

    await db.insert(summaries).values({
      id: nanoid(),
      meetingId: meetingId,
      summary: summary.trim(),
      actionItems: actionItems ? actionItems.trim() : "",
    });

    await db
      .update(meetings)
      .set({ status: "summarized" })
      .where(eq(meetings.id, meetingId));

    return NextResponse.json({ message: "Summarization complete" });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { error: "Failed to summarize transcript" },
      { status: 500 },
    );
  }
}
