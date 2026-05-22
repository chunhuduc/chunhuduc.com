import { Suspense } from "react";
import AdminChatClient from "./AdminChatClient";

export default function AdminChatPage() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-sm text-muted">Loading inbox…</div>}>
      <AdminChatClient />
    </Suspense>
  );
}
