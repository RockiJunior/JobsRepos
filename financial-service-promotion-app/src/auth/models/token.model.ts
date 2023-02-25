export interface PayloadToken {
  id: number;
  role: string;
  email: string;
  date: Date;
}

export interface PayloadRefreshToken {
  id: number;
  role: string;
  email: string;
  sessionId: number;
  date: Date;
}
