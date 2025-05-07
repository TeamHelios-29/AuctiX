export interface IUser {
  username?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fcmTokens?: string[];
  profile_photo?: string | null;
  role?: string | null;
}
