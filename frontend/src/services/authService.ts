import { IAuthUser } from '@/types/IAuthUser';

export const getStoredAuthUser = () => {
  console.log('getStoredAuthUser called');
  let valiedAuthUser: IAuthUser | null = null;
  try {
    const storedAuthUser = localStorage.getItem('authUser');
    if (storedAuthUser != 'undefined' && storedAuthUser != null) {
      valiedAuthUser = JSON.parse(storedAuthUser) as IAuthUser;
    }
  } catch (e) {
    console.error('AuthData corrupted');
    localStorage.removeItem('authUser');
  }
  return valiedAuthUser;
};
