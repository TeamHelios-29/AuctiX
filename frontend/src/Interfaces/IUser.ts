export interface IUser {
  // change later
  id?: string;
  username?: string;
  token: string;
  role?: string;
  email?: string;
}

export interface ITableUser {
  id: string;
  username: string;
  email: string;
  role: string;
  actions?: React.ReactNode;
}
