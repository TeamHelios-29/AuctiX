export interface IUser {
  username?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fcmTokens?: string[];
  profile_photo: string;
  banner_photo: string;
  role?: string | null;
}
