export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginUser {
  id: string;
  username: string;
}

export interface LoginResult {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: LoginUser;
}
