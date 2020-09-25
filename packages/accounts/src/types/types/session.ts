export interface Session {
  id: string;
  userId: string;
  token: string;
  valid: boolean;
  userAgent?: string;
  ip?: string;
  createdAt: string;
  updatedAt: string;
}
