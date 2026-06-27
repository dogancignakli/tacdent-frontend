export type UserRole = "Admin" | "Staff";

const ROLE_COOKIE = "tacdent_role";

export function getRole(): UserRole | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${ROLE_COOKIE}=`));

  if (!match) {
    return null;
  }

  const value = decodeURIComponent(match.split("=")[1] ?? "");
  return value === "Admin" || value === "Staff" ? value : null;
}

export function isAuthenticated(): boolean {
  return getRole() !== null;
}

export function isAdmin(): boolean {
  return getRole() === "Admin";
}
