export interface RegisterResponse {
  user: {
    username: string;
    id: string;
    name: string;
  };
  tokens: {
    auth: string;
    refresh: string;
  };
}
