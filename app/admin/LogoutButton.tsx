"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="meta italic hover:text-[var(--accent)]"
    >
      logout
    </button>
  );
}
