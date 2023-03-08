export interface RegisterResponse {
  user: {
    username: string;
    id: string;
    name: string;
  };
  token: string;
}
