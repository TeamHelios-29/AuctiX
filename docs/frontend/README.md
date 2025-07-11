[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```

# Auth Module

## Authentication Related Functions


```js
import { login } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/hooks/hooks';
import { IAuthUser } from '@/types/IAuthUser';

exprot function FunctionalComponent(){
  
  const dispatch = useAppDispatch();
  //...
  dispatch(
    login({
      token,
      username,
      role
    } as IAuthUser),
  );  

}
```

  ```js
  import { logout } from '@/store/slices/authSlice';
    //...
    export function FunctionalComponent() {
      dispatch(logout());
    }
  ```

  ## Authentication Related Info

  ```js
  import { useAppSelector } from '@/hooks/hooks';

  export function FunctionalComponent() {
      const authUser = useAppSelector(
        (state) => state.auth
      );

      // authUser.role  : null|'SELLER'|'BIDDER'|'ADMIN'
      // authUser.token : null|string
  }
  ```

  ## Protect Routes

  Use the `RequireAuth` component to protect routes that require authentication:

  ```js
  // add protected page to AppRouter
  // redirectPath is optional
  // force redirects will be used to force user for an action
  // such as completing the profile if not completed 
  // or force to upload verification document if user account is reported by users

  <Route
    path="/page_path"
    element={
      <ProtectedRoute
        allowedUsers={['SELLER']} 
        redirectPath="/403"
        ignorePendingForceRedirects={true}
      >
        <YourPage />
      </ProtectedRoute>
    }
  />
  ```
# User module

## Get User Data

```js
  import { useAppSelector } from '@/hooks/hooks';

  export function FunctionalComponent() {
      const userData = useAppSelector(
        (state) => state.user
      );

      // userData.username: string | null;
      // userData.email: string | null;
      // userData.firstName: string | null;
      // userData.lastName: string | null;
      // userData.fcmTokens: string[];
      // userData.profile_photo: string | null;
      // userData.role: string | null;
  }
```
