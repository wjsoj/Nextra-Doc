import { auth } from "../../auth";
import SessionData from "../../components/session-data";

export default async function Page() {
  const session = await auth();
  return (
    <div>
      <SessionData session={session} />
    </div>
  );
}
