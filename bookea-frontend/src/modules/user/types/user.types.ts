export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}
 
export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}
 
export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}
 
export interface AvatarUploadResponse {
  avatarUrl: string;
}
 