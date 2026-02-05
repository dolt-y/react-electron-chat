export interface FriendProfile {
  id: number;
  username: string;
  avatar?: string | null;
  online?: boolean;
  signature?: string | null;
  intro?: string | null;
  phone?: string | null;
  email?: string | null;
  location?: string | null;
  createdAt?: string | null;
}
