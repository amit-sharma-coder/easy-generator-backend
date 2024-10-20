export interface ISignupReturnType {
  message: string;
}

export interface IJwtPayload {
  email: string;
}

export interface ILoginReturnType {
  message: string;
  token: string;
}