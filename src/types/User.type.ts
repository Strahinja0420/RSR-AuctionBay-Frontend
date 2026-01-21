export type User = {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string | null;

  createdAt: string; // ISO string from backend
  updatedAt: string;
};
