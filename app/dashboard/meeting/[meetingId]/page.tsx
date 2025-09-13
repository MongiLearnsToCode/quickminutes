"use client";

import { db } from "@/db/drizzle";
import { meetings, summaries, transcripts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function getMeetingDetails(meetingId: string) {
  const [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meetingId));

  if (!meeting) {
    notFound();
  }

  const [transcript] = await db
    .select()
    .from(transcripts)
    .where(eq(transcripts.meetingId, meetingId));

  const [summary] = await db
    .select()
    .from(summaries)
    .where(eq(summaries.meetingId, meetingId));

  return { meeting, transcript, summary };
}

function downloadTxtFile(content: string, filename: string) {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}

function downloadPdfFile(content: string, filename: string) {
  const doc = new jsPDF();
  doc.text(content, 10, 10);
  doc.save(filename);
}

export default function MeetingDetailsPage({ params }: { params: { meetingId: string } }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<any>(null);
  const [transcript, setTranscript] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { meeting, transcript, summary } = await getMeetingDetails(
        params.meetingId,
      );
      setMeeting(meeting);
      setTranscript(transcript);
      setSummary(summary);

      if (meeting) {
        try {
          const response = await fetch("/api/get-signed-url", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: meeting.filePath }),
          });

          if (!response.ok) {
            throw new Error("Failed to get signed URL");
          }

          const { url } = await response.json();
          setSignedUrl(url);
        } catch (error) {
          console.error("View file error:", error);
          toast.error("Failed to load audio file");
        }
      }
    }

    fetchData();
  }, [params.meetingId]);

  const deleteMeeting = async () => {
    try {
      const response = await fetch("/api/delete-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetingId: params.meetingId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete meeting");
      }

      toast.success("Meeting deleted successfully");
      router.push("/dashboard/history");
    } catch (error) {
      console.error("Delete meeting error:", error);
      toast.error("Failed to delete meeting");
    }
  };

  if (!meeting) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight">Meeting Details</h1>
        <Button variant="destructive" onClick={deleteMeeting}>
          Delete Meeting
        </Button>
      </div>
      {signedUrl && <audio controls src={signedUrl} />}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Transcript</h2>
          <div className="p-4 mt-2 border rounded-md bg-gray-50 dark:bg-gray-900">
            <p className="whitespace-pre-wrap">{transcript?.text}</p>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() =>
                downloadTxtFile(transcript?.text || "", "transcript.txt")
              }
            >
              Export as TXT
            </Button>
            <Button
              onClick={() =>
                downloadPdfFile(transcript?.text || "", "transcript.pdf")
              }
            >
              Export as PDF
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Summary</h2>
          <div className="p-4 mt-2 border rounded-md bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-semibold">Summary</h3>
            <p className="whitespace-pre-wrap">{summary?.summary}</p>
            <h3 className="mt-4 text-lg font-semibold">Action Items</h3>
            <p className="whitespace-pre-wrap">{summary?.actionItems}</p>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() =>
                downloadTxtFile(
                  `Summary:\n${summary?.summary}\n\nAction Items:\n${summary?.actionItems}`,
                  "summary.txt",
                )
              }
            >
              Export as TXT
            </Button>
            <Button
              onClick={() =>
                downloadPdfFile(
                  `Summary:\n${summary?.summary}\n\nAction Items:\n${summary?.actionItems}`,
                  "summary.pdf",
                )
              }
            >
              Export as PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
