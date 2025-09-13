import { db } from "@/db/drizzle";
import { meetings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getMeetings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return [];
  }

  const userMeetings = await db
    .select()
    .from(meetings)
    .where(eq(meetings.userId, session.user.id));

  return userMeetings;
}

export default async function HistoryPage() {
  const meetings = await getMeetings();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Meeting History</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => (
          <Link href={`/dashboard/meeting/${meeting.id}`} key={meeting.id}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="truncate">{meeting.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{new Date(meeting.createdAt).toLocaleDateString()}</span>
                  <Badge
                    variant={meeting.status === "summarized" ? "default" : "secondary"}
                  >
                    {meeting.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
