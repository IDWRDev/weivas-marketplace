import Link from "next/link";
import { Card } from "@/components/ui/Primitives";
import { requireArea } from "@/server/auth/session";
import { db } from "@/server/db/client";

export default async function Page() {
  const session = await requireArea("account");
  const events = await db.securityEvent.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <>
      <header className="dash-head">
        <div>
          <small>ACCOUNT PROTECTION</small>
          <h1>Security</h1>
          <p>Review recent security activity and manage sessions.</p>
        </div>
      </header>
      <div className="dash-grid">
        <Card className="span2">
          <h2>Recent security events</h2>
          {events.length ? (
            events.map((event) => (
              <p key={event.id}>
                <b>{event.type.replaceAll("_", " ")}</b> · {event.createdAt.toLocaleString()}
              </p>
            ))
          ) : (
            <p>No recent security events.</p>
          )}
        </Card>
        <Card>
          <h2>Sessions</h2>
          <Link className="button" href="/api/auth/signout">
            Sign out this session
          </Link>
          <p>Sign out all sessions will be enabled with the session-revocation store.</p>
        </Card>
      </div>
    </>
  );
}
