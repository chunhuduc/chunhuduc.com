import { verifyAdminCookie } from "@/lib/admin-auth";

export function isAdminRequest(request: Request): boolean {
  return verifyAdminCookie(request.headers.get("cookie"));
}
