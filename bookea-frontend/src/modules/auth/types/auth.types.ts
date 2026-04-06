export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  postalCode: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}
